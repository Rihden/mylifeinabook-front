import { PDFDocument, cmyk } from 'pdf-lib'
import { serverUrl } from './severUrl'

import fontkit from '@pdf-lib/fontkit'
const DISTANCE_PER_MM = 2.835;

//merge  isEditingFront + options
async function generateCover(currentCover, isEditingFront, selectedStyleData) {
    if (isEditingFront) {

        const pdfData = await generateFrontCover(currentCover.front, selectedStyleData);
        return pdfData;
    }
    else {
        const options = currentCover.back;
        options.title = currentCover.front.title;
        options.subtitle = currentCover.front.subtitle;
        const pdfData = await generateBackCover(currentCover.back, selectedStyleData);
        return pdfData;
    }
}

async function generateFrontCover(options, selectedStyleData) {
    try {
        let existingPdfBytes = selectedStyleData.pdfData64.front;
        const coordinates = selectedStyleData.coordinates.front;
        const regularFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Regular.ttf").then(res => res.arrayBuffer())
        const italicFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Italic.ttf").then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        pdfDoc.registerFontkit(fontkit)


        //Change font to be fetched from selectedStyleData
        const ptSerifFontItalic = await pdfDoc.embedFont(italicFontBytes)
        const ptSerifFontRegular = await pdfDoc.embedFont(regularFontBytes)

        const firstPage = pdfDoc.getPages()[0]
        const { width } = firstPage.getSize();
        let titleFont;
        let title = options.title
        if (coordinates.title.case === "uppercase") {
            title = options.title.toUpperCase()
        }
        if (coordinates.title.fontWeight === "italic") {
            titleFont = ptSerifFontItalic
        }
        if (coordinates.title.fontWeight === "regular") {
            titleFont = ptSerifFontRegular
        }
        if (title) {
            const c = coordinates.title.color[0]
            const m = coordinates.title.color[1]
            const y = coordinates.title.color[2]
            const k = coordinates.title.color[3]

            if (coordinates.title.align == "center") {
                const words = title.split(" ");
                let lines = [];
                let currentLine = " " + words[words.length - 1];
                for (let indexWords = words.length - 2; indexWords > -1; indexWords--) {
                    const width = titleFont.widthOfTextAtSize(" " + words[indexWords] + currentLine, coordinates.title.fontSize);
                    if (width > coordinates.title.maxWidth) {
                        lines.unshift(currentLine);
                        currentLine = " " + words[indexWords];
                    }
                    else {
                        currentLine = " " + words[indexWords] + currentLine;
                    }
                }
                lines.unshift(currentLine);

                lines.forEach((line, index) => {
                    if (line) {
                        const lineWidth = titleFont.widthOfTextAtSize(lines[index], coordinates.title.fontSize);
                        let x = width / 2 + coordinates.title.offsetX - lineWidth / 2;
                        firstPage.drawText(lines[index], {
                            x,
                            y: coordinates.title.offsetY - coordinates.title.lineHeight * index,
                            size: coordinates.title.fontSize,
                            lineHeight: coordinates.title.lineHeight,
                            font: titleFont,
                            color: cmyk(c, m, y, k),
                            maxWidth: coordinates.title.maxWidth,
                        })
                    }
                })

            }
            else {

                let x = width / 2 + coordinates.title.offsetX - coordinates.title.maxWidth / 2

                firstPage.drawText(title, {
                    x,
                    y: coordinates.title.offsetY,
                    size: coordinates.title.fontSize,
                    lineHeight: coordinates.title.lineHeight,
                    font: titleFont,
                    color: cmyk(c, m, y, k),
                    maxWidth: coordinates.title.maxWidth,
                })


            }
        }
        let imageX = 0;
        let imageY = 0;
        let imageWidth = 0;
        let imageHeight = 0;
        if (options.imageData) {

            const embeddedImage = await pdfDoc.embedJpg(options.imageData);
            const scaledImage = embeddedImage.scaleToFit(coordinates.image.fitWidth, coordinates.image.fitHeight)
            imageWidth = scaledImage.width;
            imageHeight = scaledImage.height;
            if (coordinates.image.hasShadows) {
                coordinates.image.shadows.forEach(shadow => {
                    console.log(shadow)
                    const heightModifier = shadow.offsetY < 0 ? -1 : 1;
                    const widthModifier = shadow.offsetX < 0 ? -1 : 1;

                    let shadowWidth = shadow.width;
                    let shadowHeight = shadow.height;

                    if (shadow.isRelativeWidth) {
                        shadowWidth = (shadow.width * scaledImage.width);
                    }

                    if (shadow.isRelativeHeight) {
                        shadowHeight = (shadow.height * scaledImage.height);
                    }
                    let shadowX
                    let shadowY

                    if (shadow.offsetX === 0) {

                        shadowX = coordinates.image.offsetX + (shadowHeight * widthModifier) / 2;

                    } else {

                        shadowX = coordinates.image.offsetX + (scaledImage.width * widthModifier) / 2 + shadow.offsetX;

                    }

                    if (shadow.offsetY === 0) {

                        shadowY = coordinates.image.offsetY + (shadowHeight * heightModifier) / 2;
                    } else {

                        shadowY = coordinates.image.offsetY + (scaledImage.height * heightModifier) / 2 + shadow.offsetY;
                    }

                    // reduce offset to match shadow left corner if shadow is to the right
                    if (widthModifier === 1) {
                        shadowX -= shadowWidth;
                    }
                    // reduce offset to match shadow bottom corner if shadow is upwards
                    if (heightModifier === 1) {
                        shadowY -= shadowHeight
                    }

                    firstPage.drawRectangle({
                        x: shadowX,
                        y: shadowY,
                        width: shadowWidth,
                        height: shadowHeight,
                        color: cmyk(shadow.color[0], shadow.color[1], shadow.color[2], shadow.color[3]),
                        opacity: shadow.opacity,
                    })
                })

            }
            imageX = coordinates.image.offsetX - scaledImage.width / 2
            imageY = coordinates.image.offsetY - scaledImage.height / 2
            firstPage.drawImage(embeddedImage, {
                x: imageX,
                y: imageY,
                width: scaledImage.width,
                height: scaledImage.height,
            })
        }
        if (options.subtitle.length > 0) {
            let subtitleFont;
            let subtitleX = coordinates.subtitle.offsetX;
            if (coordinates.subtitle.case === "uppercase") {
                options.subtitle = options.subtitle.toUpperCase()
            }
            if (coordinates.subtitle.fontWeight === "italic") {
                subtitleFont = ptSerifFontItalic
            }
            if (coordinates.subtitle.fontWeight === "regular") {
                subtitleFont = ptSerifFontRegular
            }
            const subtitleWidth = subtitleFont.widthOfTextAtSize(options.subtitle, coordinates.subtitle.fontSize)

            if (coordinates.subtitle.align == "center") {
                subtitleX = coordinates.subtitle.offsetX - subtitleWidth / 2
            }
            else if (coordinates.subtitle.align == "image") {
                subtitleX = imageX
            }
            const c = coordinates.subtitle.color[0]
            const m = coordinates.subtitle.color[1]
            const y = coordinates.subtitle.color[2]
            const k = coordinates.subtitle.color[3]


            firstPage.drawText(options.subtitle, {
                x: subtitleX,
                y: coordinates.subtitle.offsetY,
                size: coordinates.subtitle.fontSize,
                lineHeight: coordinates.subtitle.lineHeight,
                font: subtitleFont,
                color: cmyk(c, m, y, k),
            });

        }
        if (coordinates.svg.hasSvg) {
            const color = coordinates.svg.color
            let x = coordinates.svg.offsetX;
            let y = coordinates.svg.offsetY
            if (coordinates.svg.isImageRelative) {
                x = imageX + (imageWidth * coordinates.svg.offsetX) - coordinates.svg.width;

                y = imageY + (imageHeight * coordinates.svg.offsetY) + coordinates.svg.height
            }
            firstPage.drawSvgPath(coordinates.svg.path, {
                color: cmyk(color[0], color[1], color[2], color[3],),
                x,
                y

            })
        }

        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
        // const pdfBytes = await pdfDoc.save();

        return pdfBytes;

    } catch (error) {
        console.log(error);
    }
}


async function generateBackCover(options, selectedStyleData) {

    try {
        let existingPdfBytes = selectedStyleData.pdfData64.back;
        const coordinates = selectedStyleData.coordinates.back;
        const regularFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Regular.ttf").then(res => res.arrayBuffer())
        const italicFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Italic.ttf").then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)

        pdfDoc.registerFontkit(fontkit)


        //Change font to be fetched from selectedStyleData
        const ptSerifFontItalic = await pdfDoc.embedFont(italicFontBytes)
        const ptSerifFontRegular = await pdfDoc.embedFont(regularFontBytes)
        //Change font to be fetched from selectedStyleData
        const firstPage = pdfDoc.getPages()[0]
        if (options.imageData) {
            // const idxDot = options.imageFileName.lastIndexOf(".") + 1;
            // const extFile = options.imageFileName.substr(idxDot, options.imageFileName.length).toLowerCase();
            // let embeddedImage
            // if (extFile == "jpg" || extFile == "jpeg") {
            const embeddedImage = await pdfDoc.embedJpg(options.imageData);
            // } else if (extFile == "png") {
            //     embeddedImage = await pdfDoc.embedPng(options.imageData);
            // }

            console.log(coordinates);
            const scaledImage = embeddedImage.scaleToFit(coordinates.image.fitWidth, coordinates.image.fitHeight)
            if (coordinates.image.hasShadows) {
                coordinates.image.shadows.forEach(shadow => {
                    console.log(shadow)
                    const heightModifier = shadow.offsetY < 0 ? -1 : 1;
                    const widthModifier = shadow.offsetX < 0 ? -1 : 1;

                    let shadowWidth = shadow.width;
                    let shadowHeight = shadow.height;

                    if (shadow.isRelativeWidth) {
                        shadowWidth = (shadow.width * scaledImage.width);
                    }

                    if (shadow.isRelativeHeight) {
                        shadowHeight = (shadow.height * scaledImage.height);
                    }
                    let shadowX
                    let shadowY

                    if (shadow.offsetX === 0) {

                        shadowX = coordinates.image.offsetX + (shadowHeight * widthModifier) / 2;

                    } else {

                        shadowX = coordinates.image.offsetX + (scaledImage.width * widthModifier) / 2 + shadow.offsetX;

                    }

                    if (shadow.offsetY === 0) {

                        shadowY = coordinates.image.offsetY + (shadowHeight * heightModifier) / 2;
                    } else {

                        shadowY = coordinates.image.offsetY + (scaledImage.height * heightModifier) / 2 + shadow.offsetY;
                    }

                    // reduce offset to match shadow left corner if shadow is to the right
                    if (widthModifier === 1) {
                        shadowX -= shadowWidth;
                    }
                    // reduce offset to match shadow bottom corner if shadow is upwards
                    if (heightModifier === 1) {
                        shadowY -= shadowHeight
                    }

                    firstPage.drawRectangle({
                        x: shadowX,
                        y: shadowY,
                        width: shadowWidth,
                        height: shadowHeight,
                        color: cmyk(shadow.color[0], shadow.color[1], shadow.color[2], shadow.color[3]),
                        opacity: shadow.opacity,
                    })
                })

            }
            firstPage.drawImage(embeddedImage, {
                x: coordinates.image.offsetX - scaledImage.width / 2,
                y: coordinates.image.offsetY - scaledImage.height / 2,
                width: scaledImage.width,
                height: scaledImage.height,
            })
        }

        if (options.title.length > 0) {
            let titleText = options.title;
            let titleFont;
            if (coordinates.title.case === "uppercase") {
                titleText = options.title.toUpperCase()
            }
            if (coordinates.title.fontWeight === "italic") {
                titleFont = ptSerifFontItalic
            }
            if (coordinates.title.fontWeight === "regular") {
                titleFont = ptSerifFontRegular
            }
            const c = coordinates.title.color[0]
            const m = coordinates.title.color[1]
            const y = coordinates.title.color[2]
            const k = coordinates.title.color[3]

            if (coordinates.title.align == "center") {
                const words = titleText.split(" ");
                let lines = [];
                let currentLine = " " + words[words.length - 1];
                for (let indexWords = words.length - 2; indexWords > -1; indexWords--) {
                    const width = titleFont.widthOfTextAtSize(" " + words[indexWords] + currentLine, coordinates.title.fontSize);
                    if (width > coordinates.title.maxWidth) {
                        lines.unshift(currentLine);
                        currentLine = " " + words[indexWords];
                    }
                    else {
                        currentLine = " " + words[indexWords] + currentLine;
                    }
                }
                lines.unshift(currentLine);

                lines.forEach((line, index) => {
                    if (line) {
                        const lineWidth = titleFont.widthOfTextAtSize(lines[index], coordinates.title.fontSize);
                        let x = coordinates.title.offsetX - lineWidth / 2;
                        firstPage.drawText(lines[index], {
                            x,
                            y: coordinates.title.offsetY - coordinates.title.lineHeight * index,
                            size: coordinates.title.fontSize,
                            lineHeight: coordinates.title.lineHeight,
                            font: titleFont,
                            color: cmyk(c, m, y, k),
                            maxWidth: coordinates.title.maxWidth,
                        })
                    }
                })
            }
            else {
                firstPage.drawText(titleText, {
                    x: coordinates.title.offsetX,
                    y: coordinates.title.offsetY,
                    size: coordinates.title.fontSize,
                    lineHeight: coordinates.title.lineHeight,
                    font: titleFont,
                    color: cmyk(c, m, y, k),
                    maxWidth: coordinates.title.maxWidth
                });
            }
        }
        if (options.subtitle.length > 0) {
            let descriptionFont;
            if (coordinates.description.fontWeight === "italic") {
                descriptionFont = ptSerifFontItalic
            }
            if (coordinates.description.fontWeight === "regular") {
                descriptionFont = ptSerifFontRegular
            }
            const c = coordinates.description.color[0]
            const m = coordinates.description.color[1]
            const y = coordinates.description.color[2]
            const k = coordinates.description.color[3]



            if (coordinates.description.align == "center") {
                const authorWidth = descriptionFont.widthOfTextAtSize(options.subtitle, coordinates.description.fontSize);
                firstPage.drawText(options.subtitle, {
                    x: coordinates.description.offsetX - authorWidth / 2,
                    y: coordinates.description.offsetY,
                    size: coordinates.description.fontSize,
                    lineHeight: coordinates.description.lineHeight,
                    font: descriptionFont,
                    color: cmyk(c, m, y, k),
                    maxWidth: coordinates.description.maxWidth
                });

            } else {
                if (coordinates.description.align == "right") {
                    const authorWidth = descriptionFont.widthOfTextAtSize(options.subtitle, coordinates.description.fontSize);
                    firstPage.drawText(options.subtitle, {
                        x: coordinates.description.offsetX - authorWidth,
                        y: coordinates.description.offsetY,
                        size: coordinates.description.fontSize,
                        lineHeight: coordinates.description.lineHeight,
                        font: descriptionFont,
                        color: cmyk(c, m, y, k),
                        maxWidth: coordinates.description.maxWidth
                    });

                } else {
                    const authorWidth = descriptionFont.widthOfTextAtSize(options.subtitle, coordinates.description.fontSize);
                    firstPage.drawText(options.subtitle, {
                        x: coordinates.description.offsetX - authorWidth / 2,
                        y: coordinates.description.offsetY - coordinates.description.lineHeight - 4,
                        size: coordinates.description.fontSize,
                        lineHeight: coordinates.description.lineHeight,
                        font: descriptionFont,
                        color: cmyk(c, m, y, k),
                        maxWidth: coordinates.description.maxWidth
                    });

                }
            }


        }

        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
        // const pdfBytes = await pdfDoc.save();
        return pdfBytes;

    } catch (error) {
        console.log(error);
    }
}

async function generateFullCover(data, style, spineWidth) {
    try {

        const cover = data.cover;

        let existingPdfBytes = style.pdfData64.fullCover;
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]



        //Front
        const widthFront = 140 * DISTANCE_PER_MM;


        //Back

        // const backImage = await pdfDoc.embedJpg(data.cover.content.back.imageBase64);
        // const backScaledImage = backImage.scaleToFit(style.coordinates.back.image.fitWidth, style.coordinates.back.image.fitHeight)
        // firstPage.drawImage(backImage, {
        //     x: DISTANCE_PER_MM * (19 + 5 + 140 + 3 + 7 + 3 + 140 + 5 + 19),
        //     y: DISTANCE_PER_MM * (19 + 5),
        //     height: backScaledImage.height,
        //     width: backScaledImage.width

        // })


        let coordinates = style.coordinates.back;
        const regularFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Regular.ttf").then(res => res.arrayBuffer())
        const italicFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Italic.ttf").then(res => res.arrayBuffer())
        pdfDoc.registerFontkit(fontkit)

        //Change font to be fetched from selectedStyleData
        const ptSerifFontItalic = await pdfDoc.embedFont(italicFontBytes)
        const ptSerifFontRegular = await pdfDoc.embedFont(regularFontBytes)
        //Change font to be fetched from selectedStyleData

        if (cover.content.back.imageData) {
            // const idxDot = cover.content.back.imageFileName.lastIndexOf(".") + 1;
            // const extFile = cover.content.back.imageFileName.substr(idxDot, cover.content.back.imageFileName.length).toLowerCase();
            // let embeddedImage
            // if (extFile == "jpg" || extFile == "jpeg") {
            const embeddedImage = await pdfDoc.embedJpg(cover.content.back.imageData);
            // } else if (extFile == "png") {
            //     embeddedImage = await pdfDoc.embedPng(cover.content.back.imageData);
            // }

            const scaledImage = embeddedImage.scaleToFit(coordinates.image.fitWidth, coordinates.image.fitHeight)

            firstPage.drawImage(embeddedImage, {
                x: coordinates.image.offsetX - scaledImage.width / 2 + DISTANCE_PER_MM * (19 + 5),
                y: coordinates.image.offsetY - scaledImage.height / 2 + DISTANCE_PER_MM * (19 + 5),
                width: scaledImage.width,
                height: scaledImage.height,
            })
        }

        if (cover.content.back.description.length > 0) {
            let descriptionFont;
            if (coordinates.description.fontWeight === "italic") {
                descriptionFont = ptSerifFontItalic
            }
            if (coordinates.description.fontWeight === "regular") {
                descriptionFont = ptSerifFontRegular
            }
            const c = coordinates.description.color[0]
            const m = coordinates.description.color[1]
            const y = coordinates.description.color[2]
            const k = coordinates.description.color[3]

            firstPage.drawText(cover.content.back.description, {
                x: coordinates.description.offsetX + DISTANCE_PER_MM * (19 + 5),
                y: coordinates.description.offsetY + DISTANCE_PER_MM * (19 + 5),
                size: coordinates.description.fontSize,
                lineHeight: coordinates.description.lineHeight,
                font: descriptionFont,
                color: cmyk(c, m, y, k),
                maxWidth: coordinates.description.maxWidth
            });

        }


        coordinates = style.coordinates.front;
        let titleFont;
        let title = cover.content.front.title;
        if (coordinates.title.case === "uppercase") {
            title = cover.content.front.title.toUpperCase()
        }
        if (coordinates.title.fontWeight === "italic") {
            titleFont = ptSerifFontItalic
        }
        if (coordinates.title.fontWeight === "regular") {
            titleFont = ptSerifFontRegular
        }
        if (title) {
            const c = coordinates.title.color[0]
            const m = coordinates.title.color[1]
            const y = coordinates.title.color[2]
            const k = coordinates.title.color[3]

            if (coordinates.title.align == "center") {
                const words = title.split(" ");
                let lines = [];
                let currentLine = " " + words[words.length - 1];
                for (let indexWords = words.length - 2; indexWords > -1; indexWords--) {
                    const width = titleFont.widthOfTextAtSize(" " + words[indexWords] + currentLine, coordinates.title.fontSize);
                    if (width > coordinates.title.maxWidth) {
                        lines.unshift(currentLine);
                        currentLine = " " + words[indexWords];
                    }
                    else {
                        currentLine = " " + words[indexWords] + currentLine;
                    }
                }
                lines.unshift(currentLine);

                lines.forEach((line, index) => {
                    if (line) {
                        const lineWidth = titleFont.widthOfTextAtSize(lines[index], coordinates.title.fontSize);
                        let x = widthFront / 2 + coordinates.title.offsetX - lineWidth / 2;
                        firstPage.drawText(lines[index], {
                            x: DISTANCE_PER_MM * (19 + 5 + 140 + 11 + spineWidth + 11) + x,
                            y: DISTANCE_PER_MM * (19 + 5) + coordinates.title.offsetY - coordinates.title.lineHeight * index,
                            size: coordinates.title.fontSize,
                            lineHeight: coordinates.title.lineHeight,
                            font: titleFont,
                            color: cmyk(c, m, y, k),
                            maxWidth: coordinates.title.maxWidth,
                        })
                    }
                })

            }
            else {

                let x = widthFront / 2 + coordinates.title.offsetX - coordinates.title.maxWidth / 2

                firstPage.drawText(title, {
                    x: DISTANCE_PER_MM * (19 + 5 + 140 + 11 + spineWidth + 11) + x,
                    y: DISTANCE_PER_MM * (19 + 5) + coordinates.title.offsetY,
                    size: coordinates.title.fontSize,
                    lineHeight: coordinates.title.lineHeight,
                    font: titleFont,
                    color: cmyk(c, m, y, k),
                    maxWidth: coordinates.title.maxWidth,
                })


            }
        }
        let imageX = 0;
        if (cover.content.front.imageData) {
            // const idxDot = cover.content.front.imageFileName.lastIndexOf(".") + 1;
            // const extFile = cover.content.front.imageFileName.substr(idxDot, cover.content.front.imageFileName.length).toLowerCase();
            // let embeddedImage
            // if (extFile == "jpg" || extFile == "jpeg") {
            const embeddedImage = await pdfDoc.embedJpg(cover.content.front.imageData);
            // } else if (extFile == "png") {
            //     embeddedImage = await pdfDoc.embedPng(cover.content.front.imageData);
            // }
            const scaledImage = embeddedImage.scaleToFit(coordinates.image.fitWidth, coordinates.image.fitHeight)
            if (coordinates.image.hasShadows) {
                coordinates.image.shadows.forEach(shadow => {
                    firstPage.drawRectangle({
                        x: DISTANCE_PER_MM * (19 + 5 + 140 + 11 + spineWidth + 11) + coordinates.image.offsetX - scaledImage.width / 2 + shadow.offsetX * DISTANCE_PER_MM,
                        y: DISTANCE_PER_MM * (19 + 5) + coordinates.image.offsetY - scaledImage.height / 2 + shadow.offsetY * DISTANCE_PER_MM,
                        width: scaledImage.width,
                        height: scaledImage.height * 0.9,
                        color: cmyk(shadow.color[0], shadow.color[1], shadow.color[2], shadow.color[3]),
                        opacity: 0.5,
                    })
                })
            }

            imageX = coordinates.image.offsetX - scaledImage.width / 2
            firstPage.drawImage(embeddedImage, {
                x: DISTANCE_PER_MM * (19 + 5 + 140 + 11 + spineWidth + 11) + imageX,
                y: DISTANCE_PER_MM * (19 + 5) + coordinates.image.offsetY - scaledImage.height / 2,
                width: scaledImage.width,
                height: scaledImage.height,
            })
        }
        if (cover.content.front.subtitle.length > 0) {
            let subtitleFont;
            let subtitleX = coordinates.subtitle.offsetX;
            if (coordinates.subtitle.case === "uppercase") {
                cover.content.front.subtitle = cover.content.front.subtitle.toUpperCase()
            }
            if (coordinates.subtitle.fontWeight === "italic") {
                subtitleFont = ptSerifFontItalic
            }
            if (coordinates.subtitle.fontWeight === "regular") {
                subtitleFont = ptSerifFontRegular
            }
            const subtitleWidth = subtitleFont.widthOfTextAtSize(cover.content.front.subtitle, coordinates.subtitle.fontSize)

            if (coordinates.subtitle.align == "center") {
                subtitleX = coordinates.subtitle.offsetX - subtitleWidth / 2
            }
            else if (coordinates.subtitle.align == "image") {
                subtitleX = imageX
            }
            const c = coordinates.subtitle.color[0]
            const m = coordinates.subtitle.color[1]
            const y = coordinates.subtitle.color[2]
            const k = coordinates.subtitle.color[3]


            firstPage.drawText(cover.content.front.subtitle, {
                x: DISTANCE_PER_MM * (19 + 5 + 140 + 11 + spineWidth + 11) + subtitleX,
                y: DISTANCE_PER_MM * (19 + 5) + coordinates.subtitle.offsetY,
                size: coordinates.subtitle.fontSize,
                lineHeight: coordinates.subtitle.lineHeight,
                font: subtitleFont,
                color: cmyk(c, m, y, k),
            });



        }


        const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });

        return pdfBytes

    } catch (error) {
        console.log(error);
    }
}

export { generateCover, generateFullCover }