import Display from "./Display";

class DisplayHome extends Display {
  addHandleUpdateServings(handler) {
    this.parentDiv.addEventListener("click", (e) => {
      const theTarget = e.target.closest("button");
      if (!theTarget) return;
      const { updateTo } = theTarget.dataset;
      if (+updateTo > 0) +handler(updateTo);
    });
  }
}
export default new DisplayHome();
