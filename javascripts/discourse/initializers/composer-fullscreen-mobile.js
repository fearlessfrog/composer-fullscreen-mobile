import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  api.modifyClass("component:composer-toggles", {
    pluginId: "composer-fullscreen-mobile",

    get showFullScreenButton() {
      return !this.args.disableTextarea;
    },
  });
});
