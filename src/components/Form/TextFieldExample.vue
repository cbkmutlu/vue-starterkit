<template>
   <div>
      <v-text-field
         icon
         density="compact"
         variant="outlined" />
   </div>
</template>

<script lang="ts" setup>
// componente prop verilmek isteniyorsa TProps a tanımlanmalıdır.
// props'a varsayılan değer vermek isteniyorsa TProps a tanımlanmalıdır.
// component'i başka bir eleman sarmalıyorsa $attrs bind edilmelidir
// component'te withDefaults altında değil de yukarıda html içinde tanımlanan props'lar ezilmez direkt geçerli olur
// TProps'a tanımlanan $attrs'de yer almaz $props'tan alınır
// TProps'a tanınlanmayan $attrs'den gelir

// v-bind="props"
// prepend-icon="$search"
// density="compact"       > geçerli olur ve ezilemez
// label="Name"
// variant="outlined"

// type TProps = {
//    iconTest?: string;
//    variant?: string;
//    prependIcon?: string;
// };

// const props = withDefaults(defineProps<TField & TProps>(), {
//    variant: "outlined",
//    prependIcon: "$accountProfile"
// });

// const props = defineProps({
//    iconTest: {
//       type: String
//    },
//    variant: {
//       type: String,
//       default: "outlined"
//    },
//    prependIcon: {
//       type: String,
//       default: "$accountProfile"
//    }
// })
</script>
