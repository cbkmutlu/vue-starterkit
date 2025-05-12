<template>
   <v-card class="overflow-visible">
      <!-- {{ t("pageModule.test") }}
      <br />
      {{ t("app.language") }} -->

      <DataTable
         v-model="selected"
         v-bind:accent-header="false"
         v-bind:headers="headers"
         v-bind:items="movies"
         v-bind:loading="loading"
         v-bind:row-click="(item: (typeof movies)[number]) => console.log(item.id)"
         item-selectable="selectable"
         item-value="title"
         multi-expand
         show-expand
         show-select
         title-text="Movies">
         <template v-slot:item.director="{ value }">
            {{ value }}
         </template>

         <template v-slot:expand="{ item }">
            {{ item.details }}
         </template>

         <template v-slot:item.actions="{ item }">
            <div class="table-action text-right opacity-0 transition-opacity [tr:hover_.table-action]:!opacity-100">
               <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                     <v-btn
                        v-bind="props"
                        v-bind:variant="isHovering ? 'text' : 'plain'"
                        v-ripple.stop
                        icon="$edit"
                        @click="console.log(item)" />
                     <v-btn
                        v-bind="props"
                        v-bind:variant="isHovering ? 'text' : 'plain'"
                        v-ripple.stop
                        icon="$accountProfile" />
                  </template>
               </v-hover>
            </div>
         </template>
      </DataTable>

      <pre>{{ selected }}</pre>
   </v-card>
</template>

<script lang="ts" setup>
import DataTable from "@/assets/components/Table/DataTable.vue";

const loading = ref(false);

const selected = ref([]);
const headers = [
   { title: "Title", key: "title", width: 300 },
   { title: "Director", key: "director" },
   { title: "Genre", key: "genre" },
   { title: "Year", key: "year" },
   { title: "Runtime(min)", key: "runtime", align: "end" as const },
   { title: "", key: "actions", sortable: false, align: "end" as const }
];

const movies = [
   {
      id: 1,
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      genre: "Drama",
      year: 1994,
      runtime: 142,
      selectable: false,
      details: {
         synopsis: "Two imprisoned men bond over years, finding solace and redemption through acts of decency.",
         cast: ["Tim Robbins", "Morgan Freeman"],
         rating: 3.5
      }
   },
   {
      id: 2,
      title: "Inception",
      director: "Christopher Nolan",
      genre: "Sci-Fi",
      year: 2010,
      runtime: 148,
      details: {
         synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
         cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
         rating: 4
      }
   },
   {
      id: 3,
      title: "The Godfather",
      director: "Francis Ford Coppola",
      genre: "Crime",
      year: 1972,
      runtime: 175
   },
   {
      id: 4,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      genre: "Crime",
      year: 1994,
      runtime: 154
   },
   {
      id: 5,
      title: "The Dark Knight",
      director: "Christopher Nolan",
      genre: "Action",
      year: 2008,
      runtime: 152
   },
   {
      id: 6,
      title: "The Lord of the Rings: The Return of the King",
      director: "Peter Jackson",
      genre: "Adventure",
      year: 2003,
      runtime: 201
   },
   {
      id: 7,
      title: "Schindler's List",
      director: "Steven Spielberg",
      genre: "Drama",
      year: 1993,
      runtime: 195
   },
   {
      id: 8,
      title: "Gladiator",
      director: "Ridley Scott",
      genre: "Action",
      year: 2000,
      runtime: 155
   },
   {
      id: 9,
      title: "The Matrix",
      director: "Lana Wachowski",
      genre: "Action",
      year: 1999,
      runtime: 136
   },
   {
      id: 10,
      title: "Goodfellas",
      director: "Martin Scorsese",
      genre: "Crime",
      year: 1990,
      runtime: 145
   },
   {
      id: 11,
      title: "The Silence of the Lambs",
      director: "Jonathan Demme",
      genre: "Thriller",
      year: 1991,
      runtime: 118
   },
   {
      id: 12,
      title: "Star Wars: Episode IV - A New Hope",
      director: "George Lucas",
      genre: "Action",
      year: 1977,
      runtime: 121
   },
   {
      id: 13,
      title: "Forrest Gump",
      director: "Robert Zemeckis",
      genre: "Drama",
      year: 1994,
      runtime: 142
   },
   {
      id: 14,
      title: "The Prestige",
      director: "Christopher Nolan",
      genre: "Drama",
      year: 2006,
      runtime: 130
   },
   {
      id: 15,
      title: "The Departed",
      director: "Martin Scorsese",
      genre: "Crime",
      year: 2006,
      runtime: 151
   },
   {
      id: 16,
      title: "The Avengers",
      director: "Joss Whedon",
      genre: "Action",
      year: 2012,
      runtime: 143
   },
   {
      id: 17,
      title: "The Social Network",
      director: "David Fincher",
      genre: "Drama",
      year: 2010,
      runtime: 120
   },
   {
      id: 18,
      title: "Inglourious Basterds",
      director: "Quentin Tarantino",
      genre: "Action",
      year: 2009,
      runtime: 153
   },
   {
      id: 19,
      title: "The Dark Knight Rises",
      director: "Christopher Nolan",
      genre: "Action",
      year: 2012,
      runtime: 164
   },
   {
      id: 20,
      title: "Fight Club",
      director: "David Fincher",
      genre: "Drama",
      year: 1999,
      runtime: 139
   },
   {
      id: 21,
      title: "Interstellar",
      director: "Christopher Nolan",
      genre: "Sci-Fi",
      year: 2014,
      runtime: 169
   },
   {
      id: 22,
      title: "Whiplash",
      director: "Damien Chazelle",
      genre: "Drama",
      year: 2014,
      runtime: 106
   },
   {
      id: 23,
      title: "Mad Max: Fury Road",
      director: "George Miller",
      genre: "Action",
      year: 2015,
      runtime: 120
   },
   {
      id: 24,
      title: "The Lion King",
      director: "Roger Allers",
      genre: "Animation",
      year: 1994,
      runtime: 88
   },
   {
      id: 25,
      title: "Back to the Future",
      director: "Robert Zemeckis",
      genre: "Sci-Fi",
      year: 1985,
      runtime: 116
   },
   {
      id: 26,
      title: "The Grand Budapest Hotel",
      director: "Wes Anderson",
      genre: "Comedy",
      year: 2014,
      runtime: 99
   },
   {
      id: 27,
      title: "The Sixth Sense",
      director: "M. Night Shyamalan",
      genre: "Thriller",
      year: 1999,
      runtime: 107
   },
   {
      id: 28,
      title: "Jurassic Park",
      director: "Steven Spielberg",
      genre: "Adventure",
      year: 1993,
      runtime: 127
   },
   {
      id: 29,
      title: "The Truman Show",
      director: "Peter Weir",
      genre: "Comedy",
      year: 1998,
      runtime: 103
   },
   {
      id: 30,
      title: "The Pianist",
      director: "Roman Polanski",
      genre: "Biography",
      year: 2002,
      runtime: 150
   },
   {
      id: 31,
      title: "The Green Mile",
      director: "Frank Darabont",
      genre: "Drama",
      year: 1999,
      runtime: 189
   },
   {
      id: 32,
      title: "Schindler's List",
      director: "Steven Spielberg",
      genre: "Biography",
      year: 1993,
      runtime: 195
   },
   {
      id: 33,
      title: "Braveheart",
      director: "Mel Gibson",
      genre: "Biography",
      year: 1995,
      runtime: 178
   },
   {
      id: 34,
      title: "The Shining",
      director: "Stanley Kubrick",
      genre: "Horror",
      year: 1980,
      runtime: 146
   },
   {
      id: 35,
      title: "Alien",
      director: "Ridley Scott",
      genre: "Sci-Fi",
      year: 1979,
      runtime: 117
   },
   {
      id: 36,
      title: "Apocalypse Now",
      director: "Francis Ford Coppola",
      genre: "Drama",
      year: 1979,
      runtime: 147
   },
   {
      id: 37,
      title: "Django Unchained",
      director: "Quentin Tarantino",
      genre: "Western",
      year: 2012,
      runtime: 165
   },
   {
      id: 38,
      title: "Gladiator",
      director: "Ridley Scott",
      genre: "Action",
      year: 2000,
      runtime: 155
   },
   {
      id: 39,
      title: "The Matrix Reloaded",
      director: "Lana Wachowski",
      genre: "Action",
      year: 2003,
      runtime: 138
   },
   {
      id: 40,
      title: "The Matrix Revolutions",
      director: "Lana Wachowski",
      genre: "Action",
      year: 2003,
      runtime: 129
   },
   {
      id: 41,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      director: "Peter Jackson",
      genre: "Fantasy",
      year: 2001,
      runtime: 178
   },
   {
      id: 42,
      title: "The Lord of the Rings: The Two Towers",
      director: "Peter Jackson",
      genre: "Fantasy",
      year: 2002,
      runtime: 179
   },
   {
      id: 43,
      title: "The Lord of the Rings: The Return of the King",
      director: "Peter Jackson",
      genre: "Fantasy",
      year: 2003,
      runtime: 201
   },
   {
      id: 44,
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      genre: "Crime",
      year: 1994,
      runtime: 154
   },
   {
      id: 45,
      title: "Forrest Gump",
      director: "Robert Zemeckis",
      genre: "Drama",
      year: 1994,
      runtime: 142
   }
];
</script>
