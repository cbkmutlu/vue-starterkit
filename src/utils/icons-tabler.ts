import {
   IconAlertSquareRoundedFilled,
   IconBell,
   IconCalendar,
   IconCaretDownFilled,
   IconCaretRightFilled,
   IconCheck,
   IconChevronDown,
   IconChevronLeft,
   IconChevronLeftPipe,
   IconChevronRight,
   IconChevronRightPipe,
   IconChevronUp,
   IconCircle,
   IconCircleCheckFilled,
   IconCircleDotFilled,
   IconCircleFilled,
   IconCircleX,
   IconCloudUpload,
   IconColorPicker,
   IconDotsVertical,
   IconGitBranch,
   IconHeartHandshake,
   IconInfoSquareRoundedFilled,
   IconLanguage,
   IconLogin,
   IconLogout,
   IconMenu2,
   IconMinus,
   IconMoonStars,
   IconPaperclip,
   IconPencil,
   IconPlus,
   IconRefresh,
   IconSearch,
   IconSelector,
   IconSettings,
   IconSortAscending,
   IconSortDescending,
   IconSquareRounded,
   IconSquareRoundedCheckFilled,
   IconSquareRoundedMinusFilled,
   IconStar,
   IconStarFilled,
   IconStarHalfFilled,
   IconSun,
   IconUser,
   IconUserCog,
   IconUserMinus,
   IconUserPlus,
   IconX
} from "@tabler/icons-vue";

const tablerAliases = {
   // vuetify default
   calendar: IconCalendar,
   cancel: IconCircleX,
   checkboxIndeterminate: IconSquareRoundedMinusFilled,
   checkboxOff: IconSquareRounded,
   checkboxOn: IconSquareRoundedCheckFilled,
   clear: IconX,
   close: IconX,
   collapse: IconChevronUp,
   complete: IconCheck,
   delete: IconCircleX,
   delimiter: IconCircleFilled,
   dropdown: IconCaretDownFilled,
   edit: IconPencil,
   error: IconCircleX,
   expand: IconChevronDown,
   eyeDropper: IconColorPicker,
   file: IconPaperclip,
   first: IconChevronLeftPipe,
   info: IconInfoSquareRoundedFilled,
   last: IconChevronRightPipe,
   loading: IconRefresh,
   menu: IconMenu2,
   minus: IconMinus,
   next: IconChevronRight,
   plus: IconPlus,
   prev: IconChevronLeft,
   radioOff: IconCircle,
   radioOn: IconCircleDotFilled,
   ratingEmpty: IconStar,
   ratingFull: IconStarFilled,
   ratingHalf: IconStarHalfFilled,
   sortAsc: IconSortAscending,
   sortDesc: IconSortDescending,
   subgroup: IconCaretDownFilled,
   success: IconCircleCheckFilled,
   treeviewCollapse: IconCaretDownFilled,
   treeviewExpand: IconCaretRightFilled,
   unfold: IconSelector,
   upload: IconCloudUpload,
   warning: IconAlertSquareRoundedFilled,

   branch: IconGitBranch,
   handShake: IconHeartHandshake,
   notification: IconBell,
   search: IconSearch,
   dots: IconDotsVertical,
   translate: IconLanguage,
   settings: IconSettings,

   // account
   accountProfile: IconUser,
   accountAdd: IconUserPlus,
   accountRemove: IconUserMinus,
   accountSettings: IconUserCog,
   accountLogin: IconLogin,
   accountLogout: IconLogout,

   // theme
   themeDark: IconMoonStars,
   themeLight: IconSun,

   // arrow
   chevronRight: IconChevronRight,
   chevronLeft: IconChevronLeft

   // IconReplaceFilled
};

const tabler = {
   component: (props: IconProps) => {
      return h(props.tag, [h(tablerAliases[props.icon as keyof typeof tablerAliases])]);
   }
};

export { tabler, tablerAliases };

