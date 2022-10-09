import {
  drawCenteredParagraph,
  drawInteriorJustifiedParagraph,
  drawInteriorCenteredParagraph,
  drawStoryImage,
  addPage,
  drawOrnament,
} from "./pdfUtils"
import { PDFDocument } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import { serverUrl } from "./severUrl"
import {
  DISTANCE_PER_MM,
  pageHeight,
  pageWidth,
  pagePaddingBottom,
  paginationFontSize,
  chapterTitleText,
  textColor,
} from "./bookStyling"

async function generateBook(book, bookStyles) {
  try {
    const regularFontBytes = await fetch(
      serverUrl + "/fonts/" + "PTSerif-Regular.ttf"
    ).then((res) => res.arrayBuffer())
    const boldFontBytes = await fetch(
      serverUrl + "/fonts/" + "PTSerif-Bold.ttf"
    ).then((res) => res.arrayBuffer())
    const italicFontBytes = await fetch(
      serverUrl + "/fonts/" + "PTSerif-Italic.ttf"
    ).then((res) => res.arrayBuffer())
    const pdfDoc = await PDFDocument.create()

    pdfDoc.registerFontkit(fontkit)

    const ptSerifFontBold = await pdfDoc.embedFont(boldFontBytes)
    const ptSerifFontRegular = await pdfDoc.embedFont(regularFontBytes)
    const ptSerifFontItalic = await pdfDoc.embedFont(italicFontBytes)

    const ornamentImage = await pdfDoc.embedJpg(bookStyles.ornament)

    if (book.pagesCount % 2 == 1) {
      pdfDoc.addPage([
        pageWidth * DISTANCE_PER_MM,
        pageHeight * DISTANCE_PER_MM,
      ])
    }

    try {
      const chapter = book.chapters[0]
      if (chapter?.answeredStoriesCount > 0 && chapter?.isActive) {
        const newPage = await pdfDoc.addPage([
          pageWidth * DISTANCE_PER_MM,
          pageHeight * DISTANCE_PER_MM,
        ])
        const chapterPageHeight = pageHeight * DISTANCE_PER_MM
        await drawCenteredParagraph(chapter.title, {
          fontSize: chapterTitleText.fontSize,
          lineHeight: chapterTitleText.lineHeight,
          color: chapterTitleText.color,
          maxWidth: chapterTitleText.maxWidth * DISTANCE_PER_MM,
          font: ptSerifFontBold,
          offsetY: chapterPageHeight / 2,
          page: newPage,
        })
        await generateChapter(chapter.stories, {
          ptSerifFontItalic,
          ptSerifFontBold,
          ptSerifFontRegular,
          ornamentImage,
          doc: pdfDoc,
        })
      }
    } catch (error) {
      console.log("errrr", error)
    }

    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.log(error)
  }
}

async function generateChapter(stories, options) {
  const {
    ptSerifFontItalic,
    ptSerifFontBold,
    ptSerifFontRegular,
    ornamentImage,
    doc,
  } = options

  for (let i = 0; i < stories.length; i++) {
    await generateStory(stories[i], {
      boldFont: ptSerifFontBold,
      font: ptSerifFontRegular,
      italicFont: ptSerifFontItalic,
      ornamentImage,
      doc,
    })
  }
}
const decodeHtmlCharCodes = (str) => {
  let stro = String(str).replaceAll("'", "’")
  stro = String(str).replaceAll('"', "“")
  return stro
}

async function generateStory(content, options) {
  try {
    if (content.isAnswered === false) return
    //CHANGE
    const currentPage = await addPage(options.doc, {
      font: options.font,
      size: paginationFontSize,
      offsetY: pagePaddingBottom * DISTANCE_PER_MM,
      color: textColor,
      pageHeight,
      pageWidth,
    })
    // Embed story Image
    //Draw story title
    let nextCoordinate
    if (content.title) {
      const trimmedTitle = content.title.trim()
      nextCoordinate = await drawInteriorCenteredParagraph(trimmedTitle, {
        font: options.boldFont,
        page: currentPage,
      })
    } else {
      nextCoordinate = await drawInteriorCenteredParagraph(" ", {
        font: options.boldFont,
        page: currentPage,
      })
    }

    //Draw Ornament
    nextCoordinate = await drawOrnament(options.ornamentImage, {
      offsetY: nextCoordinate.offsetY,
      page: nextCoordinate.currentPage,
    })

    //Draw story paragraphs one at a time
    const paragraphs = content.textContent.split(/\n/)

    for (let i = 0; i < paragraphs.length; i++) {
      const formatParagraph = decodeHtmlCharCodes(paragraphs[i])
      nextCoordinate = await drawInteriorJustifiedParagraph(formatParagraph, {
        offsetY: nextCoordinate.offsetY,
        font: options.font,
        page: nextCoordinate.currentPage,
        isLastParagraph: i == paragraphs.length - 1,
      })
    }
    console.log("helleo5")

    //Draw story Image
    if (content.imageBase64) {
      let embeddedImage = await options.doc.embedJpg(content.imageBase64)

      drawStoryImage(embeddedImage, {
        offsetY: nextCoordinate.offsetY,
        font: options.font,
        caption: {
          font: options.italicFont,
          text: content.imageCaption,
        },
        page: nextCoordinate.currentPage,
      })
    }
  } catch (error) {
    console.log(error)
  }
  //Save pdf file
}

export { generateBook, generateStory }
