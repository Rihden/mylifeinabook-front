const DISTANCE_PER_MM = 2.835;
const pageHeight = 216;
const pageWidth = 154;
const pagePaddingBottom = 9;
const paginationFontSize = 8;
const textColor = [0, 0, 0, 1];
const pageOffsetX = 7;
const chapterTitleText = {
    fontSize: 22,
    lineHeight: 22,
    maxWidth: 125,
    color: textColor
};
const storyTitleStyling = {
    fontSize: 18,
    lineHeight: 21,
    offsetY: 23,
    maxWidth: 125,
    color: textColor,
    bottomMargin: 7
};
const ornamentStyling = {
    width: 45.3,
    height: 5,
    marginBottom: 11
}

const storyParagraphStying = {
    fontSize: 12,
    lineHeight: 16,
    offsetX: 11,
    maxWidth: 125,
    color: textColor,
    bottomMargin: 7
}

const imageStyling = {
    imageMaxWidth: 300,
    imageMaxHeight: 350,
    caption: {
        fontSize: 10,
        lineHeight: 13,
        maxWidth: 125
    }
}







export {
    DISTANCE_PER_MM,
    pageHeight,
    pageWidth,
    pagePaddingBottom,
    paginationFontSize,
    chapterTitleText,
    storyTitleStyling,
    textColor,
    pageOffsetX,
    ornamentStyling,
    storyParagraphStying,
    imageStyling
}