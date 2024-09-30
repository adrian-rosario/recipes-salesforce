import Display from "./Display.js";
import * as helpers from "../helpers/helpers.js";

class DisplayAddRecipe extends Display {
  parentDiv = document.querySelector(".addRecipeForm");
  _overlay = document.querySelector(".overlay");
  _formWindow = document.querySelector(".addRecipeWindow");
  _closeButton = document.querySelector(".closeButton");
  _openButton = document.querySelector(".openButton");

  _sendButton = document.querySelector(".sendRecipe");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideindow();
    // this.addUploadHandler();
  }

  generateMarkup() {}

  toggleFormDisplay() {
    // 'this' points to the element its attached to
    this._overlay.classList.toggle("hidden");
    this._formWindow.classList.toggle("hidden");
  }

  // controller does not need to know about the method, so we
  // add the constructor()
  _addHandlerShowWindow() {
    // show/hide/toggle of the Add Recipe display
    this._openButton.addEventListener(
      "click",
      this.toggleFormDisplay.bind(
        this // points to current object,
        // manually setting the 'this' keyword, otherwise
        // 'this' would be the button the event listener is attached to
      )
    );
  }

  _addHandlerHideindow() {
    this._closeButton.addEventListener(
      "click",
      this.toggleFormDisplay.bind(
        this
        // manually setting the 'this' keyword, otherwise
        // 'this' would be the button the event listener is attached to
      )
    );

    this._overlay.addEventListener(
      "click",
      this.toggleFormDisplay.bind(
        this
        // manually setting the 'this' keyword, otherwise
        // 'this' would be the button the event listener is attached to
      )
    );
  }

  addUploadHandler(handler) {
    this.parentDiv.addEventListener("submit", function (e) {
      e.preventDefault();

      // the FormData returns an object we can't really use w/o the spread
      // operator, turning the object key/values into an array
      // 'this' refers to the upload form
      const formData = [...new FormData(this)];

      // api action would be in the model
      // need a way to get data to the model
      // controller function needed to handle this event

      // takes in an array and converts to an object
      const convertedData = Object.fromEntries(formData);

      handler(convertedData);

      // helpers.log("form data", formData);
    });
  }
}

export default new DisplayAddRecipe();
