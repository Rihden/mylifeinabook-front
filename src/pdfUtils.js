import { cmyk, PDFDocument } from 'pdf-lib';
import { serverUrl } from './severUrl'
import fontkit from '@pdf-lib/fontkit';
import {
    DISTANCE_PER_MM,
    pageHeight,
    pageWidth,
    pagePaddingBottom,
    paginationFontSize,
    pageOffsetX,
    textColor,
    ornamentStyling,
    storyParagraphStying,
    storyTitleStyling,
    imageStyling

} from "./bookStyling"

import { generateStory } from './interiorGeneration';

async function drawJustifiedParagraph(text, options, page) {
    try {
        let currentOffsetY = options.offsetY
        let currentPage = page;
        const { height } = page.getSize()
        //split text into words by spaces.
        const words = text.split(/ +/);
        let nextWordWidth = 0;
        let lineNumber = 0;
        let index = 0;
        let lineWidth = 0;
        let lineWords = new Array();
        //While there's still words left in the paragraph
        while (index < words.length) {
            lineNumber++;
            lineWords = new Array(words[index]);
            lineWidth = await options.font.widthOfTextAtSize(words[index], options.fontSize)
            index++
            nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", options.fontSize) : 0
            //while there's still words and less than maxwidth
            while (lineWidth + nextWordWidth <= options.maxWidth && index < words.length) {
                lineWords.push(" " + words[index]);
                lineWidth += await options.font.widthOfTextAtSize(words[index] + " ", options.fontSize);
                index++
                nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", options.fontSize) : 0
            }
            if (index < words.length) {
                const spaceWidth = await options.font.widthOfTextAtSize(" ", options.fontSize)
                const missingSpaces = Math.round(Math.abs(options.maxWidth - lineWidth) / spaceWidth);
                let missingSpacesLeft = missingSpaces;
                while (missingSpacesLeft > 0) {
                    let spacesIndex = lineWords.length - 1;
                    while (missingSpacesLeft > 0 && spacesIndex > 0) {
                        lineWords[spacesIndex] = " " + lineWords[spacesIndex];
                        spacesIndex--;
                        missingSpacesLeft--;
                    }
                }
                let justifiedLineText = "";
                for (let indexConcat = 0; indexConcat < lineWords.length - 1; indexConcat++) {
                    justifiedLineText += lineWords[indexConcat];
                }
                const lastWord = lineWords[lineWords.length - 1]
                const lastWordWidth = await options.font.widthOfTextAtSize(lastWord, options.fontSize);
                let y = height - currentOffsetY - options.lineHeight * lineNumber;
                if (y < 60) {
                    lineNumber = 0;
                    currentOffsetY = 70
                    y = height - currentOffsetY - options.lineHeight * lineNumber;
                    currentPage = await addPage(currentPage.doc, {
                        font: options.font,
                    })
                }


                //Draw whole line without last word
                currentPage.drawText(justifiedLineText, {
                    x: options.offsetX,
                    y: y,
                    size: options.fontSize,
                    lineHeight: options.lineHeight,
                    font: options.font
                })

                //Draw last word
                currentPage.drawText(lastWord, {
                    x: options.offsetX + options.maxWidth - lastWordWidth,
                    y: y,
                    size: options.fontSize,
                    lineHeight: options.lineHeight,
                    font: options.font
                })

            }
            else {
                let justifiedLineText = "";
                for (let indexConcat = 0; indexConcat < lineWords.length; indexConcat++) {
                    justifiedLineText += lineWords[indexConcat];
                }

                let y = height - currentOffsetY - options.lineHeight * lineNumber;
                if (y < 60) {
                    lineNumber = 0;
                    currentOffsetY = 70
                    y = height - currentOffsetY - options.lineHeight * lineNumber;
                    currentPage = await addPage(currentPage.doc, { font: options.font })
                }




                //Draw whole line without last word
                currentPage.drawText(justifiedLineText, {
                    x: options.offsetX,
                    y: y,
                    size: options.fontSize,
                    lineHeight: options.lineHeight,
                    font: options.font
                })


            }
        }
        return ({ offsetY: currentOffsetY + options.lineHeight * (lineNumber + 1), currentPage })

    } catch (error) {
        console.log(error);
    }
}

async function drawInteriorJustifiedParagraph(text, options) {
    try {
        const maxWidth = storyParagraphStying.maxWidth * DISTANCE_PER_MM
        const cColor = storyTitleStyling.color[0];
        const mColor = storyTitleStyling.color[1];
        const yColor = storyTitleStyling.color[2];
        const kColor = storyTitleStyling.color[3];
        let currentOffsetY = options.offsetY
        let currentPage = options.page;
        const { height } = currentPage.getSize()
        //split text into words by spaces.
        const words = text.split(/ +/);
        let nextWordWidth = 0;
        let lineNumber = 0;
        let index = 0;
        let lineWidth = 0;
        let lineWords = new Array();
        let y;
        //While there's still words left in the paragraph
        while (index < words.length) {
            lineNumber++;
            lineWords = new Array(words[index]);
            lineWidth = await options.font.widthOfTextAtSize(words[index], storyParagraphStying.fontSize)
            index++
            nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", storyParagraphStying.fontSize) : 0
            //while there's still words and less than maxwidth
            while (lineWidth + nextWordWidth <= maxWidth && index < words.length) {
                lineWords.push(" " + words[index]);
                lineWidth += await options.font.widthOfTextAtSize(words[index] + " ", storyParagraphStying.fontSize);
                index++
                nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", storyParagraphStying.fontSize) : 0
            }
            if (index < words.length) {
                const spaceWidth = await options.font.widthOfTextAtSize(" ", storyParagraphStying.fontSize)
                const missingSpaces = Math.round(Math.abs(maxWidth - lineWidth) / spaceWidth);
                let missingSpacesLeft = missingSpaces;
                while (missingSpacesLeft > 0) {
                    let spacesIndex = lineWords.length - 1;
                    while (missingSpacesLeft > 0 && spacesIndex > 0) {
                        lineWords[spacesIndex] = " " + lineWords[spacesIndex];
                        spacesIndex--;
                        missingSpacesLeft--;
                    }
                }
                let justifiedLineText = "";
                for (let indexConcat = 0; indexConcat < lineWords.length - 1; indexConcat++) {
                    justifiedLineText += lineWords[indexConcat];
                }
                const lastWord = lineWords[lineWords.length - 1]
                const lastWordWidth = await options.font.widthOfTextAtSize(lastWord, storyParagraphStying.fontSize);
                let y = height - currentOffsetY - storyParagraphStying.lineHeight * lineNumber;
                if (y < (9 * DISTANCE_PER_MM + paginationFontSize + storyParagraphStying.lineHeight)) {
                    lineNumber = 0;
                    currentOffsetY = 70
                    y = height - currentOffsetY - storyParagraphStying.lineHeight * lineNumber;
                    currentPage = await addPage(currentPage.doc, {
                        font: options.font,

                    })
                }
                const pageOffsetModifier = currentPage.doc.getPageCount() % 2 == 0 ? 0 : 1;


                //Draw whole line without last word

                currentPage.drawText(justifiedLineText, {
                    x: storyParagraphStying.offsetX * DISTANCE_PER_MM + (pageOffsetX * DISTANCE_PER_MM * pageOffsetModifier),
                    y: y,
                    size: storyParagraphStying.fontSize,
                    lineHeight: storyParagraphStying.lineHeight,
                    font: options.font,
                    color: cmyk(cColor, mColor, yColor, kColor),
                })

                //Draw last word
                currentPage.drawText(lastWord, {
                    x: storyParagraphStying.offsetX * DISTANCE_PER_MM + (pageOffsetX * DISTANCE_PER_MM * pageOffsetModifier) + maxWidth - lastWordWidth,
                    y: y,
                    size: storyParagraphStying.fontSize,
                    lineHeight: storyParagraphStying.lineHeight,
                    font: options.font,
                    color: cmyk(cColor, mColor, yColor, kColor),
                })

            }
            else {
                let justifiedLineText = "";
                for (let indexConcat = 0; indexConcat < lineWords.length; indexConcat++) {
                    justifiedLineText += lineWords[indexConcat];
                }

                y = height - currentOffsetY - storyParagraphStying.lineHeight * lineNumber;
                if (y < (9 * DISTANCE_PER_MM + paginationFontSize + storyParagraphStying.lineHeight)) {
                    lineNumber = 0;
                    currentOffsetY = 70
                    y = height - currentOffsetY - storyParagraphStying.lineHeight * lineNumber;
                    currentPage = await addPage(currentPage.doc, {
                        font: options.font,

                    })
                }


                const pageOffsetModifier = currentPage.doc.getPageCount() % 2 == 0 ? 0 : 1

                //Draw whole line without last word
                currentPage.drawText(justifiedLineText, {
                    x: storyParagraphStying.offsetX * DISTANCE_PER_MM + (pageOffsetX * DISTANCE_PER_MM * pageOffsetModifier),
                    y: y,
                    size: storyParagraphStying.fontSize,
                    lineHeight: storyParagraphStying.lineHeight,
                    font: options.font,
                    color: cmyk(cColor, mColor, yColor, kColor),
                })


            }
        }
        let bottomMargin = 0;
        if (options.isLastParagraph) {
            bottomMargin = storyParagraphStying.bottomMargin;
        }
        return ({ offsetY: currentOffsetY + storyParagraphStying.lineHeight * (lineNumber) + (bottomMargin * DISTANCE_PER_MM), currentPage })

    } catch (error) {
        console.log(error);
    }
}

async function drawInteriorCenteredParagraph(text, options) {
    try {
        //save current page reference
        let currentPage = options.page;
        let currentOffsetY = storyTitleStyling.offsetY * DISTANCE_PER_MM;
        const { height, width } = currentPage.getSize()
        //split text into words by spaces, one linebreak.
        const words = text.split(/ +|\r?\n/);
        let nextWordWidth = 0;
        let lineNumber = 0;
        let index = 0;
        let lineWidth = 0;
        let lineText = "";
        let x = 0;
        //While there's still words to write
        while (index < words.length) {
            lineNumber++;
            lineText = words[index];
            lineWidth = await options.font.widthOfTextAtSize(words[index], storyTitleStyling.fontSize)
            index++
            //Get next word width
            nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", storyTitleStyling.fontSize) : 0
            while (lineWidth + nextWordWidth <= (storyTitleStyling.maxWidth * DISTANCE_PER_MM) && index < words.length) {
                lineText += " " + words[index]
                lineWidth += await options.font.widthOfTextAtSize(words[index] + " ", storyTitleStyling.fontSize);
                index++
                nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", storyTitleStyling.fontSize) : 0
            }
            //if text goes below a certain point in the document
            let y = height - currentOffsetY - (storyTitleStyling.lineHeight * lineNumber);
            if (y < (9 * DISTANCE_PER_MM + paginationFontSize + storyTitleStyling.lineHeight)) {
                lineNumber = 0;
                currentOffsetY = storyTitleStyling.offsetY * DISTANCE_PER_MM;
                y = height - currentOffsetY - storyTitleStyling.fontSize * lineNumber;
                currentPage = await addPage(currentPage.doc, { font: options.font })
            }
            const pageOffsetModifier = currentPage.doc.getPageCount() % 2 == 0 ? -1 : 1;
            x = (width / 2) - (lineWidth / 2) + (pageOffsetX / 2 * DISTANCE_PER_MM * pageOffsetModifier)

            const cColor = storyTitleStyling.color[0];
            const mColor = storyTitleStyling.color[1];
            const yColor = storyTitleStyling.color[2];
            const kColor = storyTitleStyling.color[3];
            currentPage.drawText(lineText, {
                x: x,
                y: y,
                size: storyTitleStyling.fontSize,
                lineHeight: storyTitleStyling.lineHeight,
                font: options.font,
                color: cmyk(cColor, mColor, yColor, kColor),
            })
        }
        return ({ offsetY: currentOffsetY + (storyTitleStyling.lineHeight * (lineNumber - 1)) + storyTitleStyling.fontSize + storyTitleStyling.bottomMargin * DISTANCE_PER_MM, currentPage })

    } catch (error) {
        console.log(error);
    }

}

async function drawCenteredParagraph(text, options) {
    try {
        //save current page reference
        const cColor = textColor[0];
        const mColor = textColor[1];
        const yColor = textColor[2];
        const kColor = textColor[3];
        let currentPage = options.page;
        let currentOffsetY = options.offsetY
        const { height, width } = currentPage.getSize()
        //split text into words by spaces, one linebreak.
        const words = text.split(/ +|\r?\n/);
        let nextWordWidth = 0;
        let lineNumber = 0;
        let index = 0;
        let lineWidth = 0;
        let lineText = "";
        //While there's still words to write
        while (index < words.length) {
            lineNumber++;
            lineText = words[index];
            lineWidth = await options.font.widthOfTextAtSize(words[index], options.fontSize)
            index++
            //Get next word width
            nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", options.fontSize) : 0
            while (lineWidth + nextWordWidth <= options.maxWidth && index < words.length) {
                lineText += " " + words[index]
                lineWidth += await options.font.widthOfTextAtSize(words[index] + " ", options.fontSize);
                index++
                nextWordWidth = (index < words.length) ? await options.font.widthOfTextAtSize(words[index] + " ", options.fontSize) : 0
            }


            //if text goes below a certain point in the document
            let y = height - currentOffsetY - options.lineHeight * lineNumber;
            if (y < 60) {
                lineNumber = 0;
                currentOffsetY = 23 * DISTANCE_PER_MM;
                y = height - currentOffsetY - options.lineHeight * lineNumber;
                currentPage = await addPage(currentPage.doc, { font: options.font })
            }

            currentPage.drawText(lineText, {
                x: (width / 2) - (lineWidth / 2),
                y: y,
                color: cmyk(cColor, mColor, yColor, kColor),
                size: options.fontSize,
                font: options.font,
            })

        }
        return ({ offsetY: options.offsetY + options.lineHeight * (lineNumber) + 10 * DISTANCE_PER_MM, currentPage })

    } catch (error) {
        console.log(error);
    }

}

async function drawStoryImage(image, options) {

    try {
        const scaledImage = image.scaleToFit(imageStyling.imageMaxWidth, imageStyling.imageMaxHeight)
        let currentPage = options.page;
        const { width, height } = currentPage.getSize();

        let imageY = height - options.offsetY - scaledImage.height;
        if ((imageY - imageStyling.caption.lineHeight) < 70) {
            imageY = height - 60 - scaledImage.height;
            currentPage = await addPage(currentPage.doc, { font: options.font })
        }
        const pageOffsetModifier = currentPage.doc.getPageCount() % 2 == 0 ? -1 : 1;
        currentPage.drawImage(image, {
            x: width / 2 - scaledImage.width / 2 + (pageOffsetX / 2 * pageOffsetModifier * DISTANCE_PER_MM),
            y: imageY,
            width: scaledImage.width,
            height: scaledImage.height
        })

        const nextCoordinate = drawCenteredParagraph(options.caption.text, {
            fontSize: imageStyling.caption.fontSize,
            lineHeight: imageStyling.caption.lineHeight,
            offsetY: height - imageY + imageStyling.caption.lineHeight / 2,
            maxWidth: imageStyling.caption.maxWidth * DISTANCE_PER_MM,
            font: options.caption.font,
            page: currentPage
        })
        return nextCoordinate;

    } catch (error) {
        console.log(error);
    }
}

async function drawOrnament(ornamentImage, options) {

    const ornamentScaled = ornamentImage.scaleToFit(ornamentStyling.width * DISTANCE_PER_MM, ornamentStyling.height * DISTANCE_PER_MM)
    const { height, width } = options.page.getSize();
    const pageOffsetModifier = options.page.doc.getPageCount() % 2 == 0 ? -1 : 1

    options.page.drawImage(ornamentImage, {
        x: (width / 2) - (ornamentScaled.width / 2) + (pageOffsetX / 2 * DISTANCE_PER_MM * pageOffsetModifier),
        y: height - options.offsetY - ornamentScaled.height,
        height: ornamentScaled.height,
        width: ornamentScaled.width
    })
    return { offsetY: options.offsetY + (ornamentStyling.marginBottom * DISTANCE_PER_MM), currentPage: options.page }
}

async function addPage(pdfDoc, options) {

    const newPage = await pdfDoc.addPage([pageWidth * DISTANCE_PER_MM, pageHeight * DISTANCE_PER_MM])
    const { width } = newPage.getSize();
    const c = textColor[0];
    const m = textColor[1];
    const y = textColor[2];
    const k = textColor[3];

    const pageOffsetModifier = newPage.doc.getPageCount() % 2 == 0 ? -1 : 1;
    newPage.drawText(pdfDoc.getPageCount().toString(), {
        x: width / 2 + (pageOffsetX / 2 * DISTANCE_PER_MM * pageOffsetModifier),
        y: pagePaddingBottom * DISTANCE_PER_MM,
        size: paginationFontSize,
        font: options.font,
        color: cmyk(c, m, y, k)
    });

    return newPage;
}

async function calculateStoryPages(content, ornament) {
    try {

        const regularFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Regular.ttf").then(res => res.arrayBuffer())
        const boldFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Bold.ttf").then(res => res.arrayBuffer())
        const italicFontBytes = await fetch(serverUrl + "/fonts/" + "PTSerif-Italic.ttf").then(res => res.arrayBuffer())


        const pdfDoc = await PDFDocument.create();

        pdfDoc.registerFontkit(fontkit)


        //Change font to be fetched from selectedStyleData
        const ptSerifFontBold = await pdfDoc.embedFont(boldFontBytes)
        const ptSerifFontRegular = await pdfDoc.embedFont(regularFontBytes)
        const ptSerifFontItalic = await pdfDoc.embedFont(italicFontBytes)
        const ornamentImage = await pdfDoc.embedJpg(ornament)


        await generateStory(content, {
            boldFont: ptSerifFontBold,
            font: ptSerifFontRegular,
            italicFont: ptSerifFontItalic,
            ornamentImage,
            doc: pdfDoc
        })

        const pagesCount = pdfDoc.getPageCount();
        return pagesCount;

    } catch (error) {
        console.log(error);
        return 0;
    }
}

export {
    drawJustifiedParagraph, drawInteriorJustifiedParagraph, drawInteriorCenteredParagraph, drawCenteredParagraph, drawStoryImage, addPage, drawOrnament, calculateStoryPages
}