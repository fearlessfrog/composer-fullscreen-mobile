import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  api.modifyClass(
    "component:composer-toggles",
    (Superclass) =>
      class extends Superclass {
        get showFullScreenButton() {
          return !this.args.disableTextarea;
        }
      }
  );
}); 
