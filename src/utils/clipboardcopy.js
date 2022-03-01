export const clipboard = () => {
  //DOES NOT WORK YET
  /**
   * Copy the content of a DOM element
   * While it is deprecated web API,it is the only one supported accross browsers
   * can only copy contents from DOM elements,
   * therefore only valid Refs to dom element should be passed to it
   * @param { Object } ElementRef a valid element Ref
   */
  function copyWithRef(ElementRef) {
    document.getSelection().empty();
    const range = document.createRange();
    range.selectNodeContents(ElementRef.current);
    const selection = document.getSelection();
    selection.addRange(range);
    document.execCommand('copy');
  }

  //   Still Work In Progress as copying with Js support is very tricky, will advice
  //   we use a less heavier package for copying
  //   See Ref: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
  return { copyWithRef };
};
