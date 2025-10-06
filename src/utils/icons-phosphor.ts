import {
   PhArrowDown,
   PhArrowsCounterClockwise,
   PhArrowUp,
   PhBell,
   PhBrowser,
   PhCalendarDots,
   PhCaretDown,
   PhCaretLeft,
   PhCaretLineLeft,
   PhCaretLineRight,
   PhCaretRight,
   PhCaretUp,
   PhCaretUpDown,
   PhCheck,
   PhCheckCircle,
   PhCheckSquare,
   PhCircle,
   PhCircleDashed,
   PhCloudArrowUp,
   PhDotsThreeVertical,
   PhEyedropper,
   PhFloppyDisk,
   PhGear,
   PhHandshake,
   PhInfo,
   PhList,
   PhMagnifyingGlass,
   PhMinus,
   PhMinusSquare,
   PhMoonStars,
   PhPackage,
   PhPaperclip,
   PhPencil,
   PhPlus,
   PhSignIn,
   PhSignOut,
   PhSquare,
   PhStar,
   PhStarHalf,
   PhSun,
   PhTranslate,
   PhTrash,
   PhUser,
   PhUserGear,
   PhUserMinus,
   PhUserPlus,
   PhWarningCircle,
   PhX
} from "@phosphor-icons/vue";

const phoAliases = {
   // vuetify default
   calendar: PhCalendarDots,
   cancel: PhX,
   checkboxIndeterminate: PhMinusSquare,
   checkboxOff: PhSquare,
   checkboxOn: PhCheckSquare,
   clear: PhX,
   close: PhX,
   collapse: PhCaretUp,
   complete: PhCheck,
   delete: PhX,
   delimiter: PhCircleDashed,
   dropdown: PhCaretDown,
   edit: PhPencil,
   error: PhX,
   expand: PhCaretDown,
   eyeDropper: PhEyedropper,
   file: PhPaperclip,
   first: PhCaretLineLeft,
   info: PhInfo,
   last: PhCaretLineRight,
   loading: PhArrowsCounterClockwise,
   menu: PhList,
   minus: PhMinus,
   next: PhCaretRight,
   plus: PhPlus,
   prev: PhCaretLeft,
   radioOff: PhCircle,
   radioOn: PhCheckCircle,
   ratingEmpty: PhStar,
   ratingFull: PhStar,
   ratingHalf: PhStarHalf,
   sortAsc: PhArrowUp,
   sortDesc: PhArrowDown,
   subgroup: PhCaretDown,
   success: PhCheckCircle,
   treeviewCollapse: PhCaretDown,
   treeviewExpand: PhCaretRight,
   unfold: PhCaretUpDown,
   upload: PhCloudArrowUp,
   warning: PhWarningCircle,
   save: PhFloppyDisk,

   handShake: PhHandshake,
   notification: PhBell,
   search: PhMagnifyingGlass,
   dots: PhDotsThreeVertical,
   translate: PhTranslate,
   settings: PhGear,
   trash: PhTrash,

   // account
   accountProfile: PhUser,
   accountAdd: PhUserPlus,
   accountRemove: PhUserMinus,
   accountSettings: PhUserGear,
   accountLogin: PhSignIn,
   accountLogout: PhSignOut,

   // theme
   themeDark: PhMoonStars,
   themeLight: PhSun,

   // arrow
   chevronRight: PhCaretRight,
   chevronLeft: PhCaretLeft,

   package: PhPackage,
   browser: PhBrowser
};

const pho = {
   component: (props: { weight?: "bold" | "fill" | "thin" | "light" | "regular" | "duotone" } & IconProps) => {
      return h(props.tag, [
         h(phoAliases[props.icon as keyof typeof phoAliases], {
            // weight: props.weight
         })
      ]);
   }
};

export { pho, phoAliases };
