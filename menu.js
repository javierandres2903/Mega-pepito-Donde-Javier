/* =====================================================================
   AJUSTES DE PRECIOS (edita aquí)
   ===================================================================== */
const PAN_BATATA_EXTRA = 0;   // costo extra de cambiar el pan de trigo por pan de batata

// Ingredientes disponibles para "Arma tu pizza".
const PIZZA_INGREDIENTES = [
  { label: "Extra de queso mozzarella" },
  { label: "Jamón de pierna" },
  { label: "Anchoa" },
  { label: "Aceitunas negras" },
  { label: "Maíz" },
  { label: "Tocineta" },
  { label: "Pepperoni" },
  { label: "Champiñones" },
  { label: "Vegetales (cebolla, pimentón)" },
  { label: "Jamón ahumado" },
  { label: "Queso amarillo" },
  { label: "Salsa pesto" },
];

/* ---------- Piezas reutilizables ---------- */
// variants = tamaños/bases con precio propio · options = elecciones adicionales
// price: null en un variant = "por definir" (se muestra pero no se puede pedir)
const mg = (mini, grande) => [{ label: "Mini", price: mini }, { label: "Grande", price: grande }];
const PROT = (vals = ["Carne", "Pollo", "Chuleta"]) =>
  ({ key: "prot", label: "Proteína", bare: true, values: vals.map((v) => ({ label: v })) });
const PROT2 = { key: "prot", label: "Proteínas", bare: true,
  values: ["Carne y pollo", "Pollo y chuleta", "Carne y chuleta"].map((v) => ({ label: v })) };
const PAN = { key: "pan", label: "Pan", def: 0,
  values: [{ label: "Trigo" }, { label: "Batata", price: PAN_BATATA_EXTRA }] };
const CEBOLLA = { key: "ceb", label: "Cebolla",
  values: [{ label: "Cruda" }, { label: "Caramelizada" }] };
const TOPPING = { key: "top", label: "Extra topping", optional: true, def: 0,
  values: [{ label: "Sin extra" }, { label: "Carne (lomito)", price: 3 }, { label: "Pollo", price: 3 }, { label: "Mixto", price: 3 }] };
const SABOR = { key: "sab", label: "Sabor",
  values: ["BBQ", "Mostaza miel", "Ajo-parmesano", "Picante"].map((v) => ({ label: v })) };

const MENU = [
 {
  id: "pepitos", label: "Pepitos", emoji: "🥖",
  items: [
   { name: "Medio Pepito Normal", price: 7, desc: "Tomate, lechuga, papitas, queso rallado y salsas.",
     options: [PROT(["Carne", "Pollo", "Mixto"])] },
   { name: "Medio Pepito Especial", price: 9, desc: "Tomate, lechuga, papitas, jamón, queso, doble tocineta, maíz y salsas.",
     options: [PROT(["Carne", "Pollo", "Mixto"])] },
   { name: "Pepito Grande Normal", price: 13, desc: "Tomate, lechuga, papitas, queso rallado y salsas.",
     options: [PROT(["Carne", "Pollo", "Mixto"])] },
   { name: "Pepito Grande Especial", price: 18, desc: "Tomate, lechuga, papitas, jamón, queso, doble tocineta, maíz y salsas.",
     options: [PROT(["Carne", "Pollo", "Mixto"])] },
   { name: "Pepito 1 Metro Clásico", price: 35,
     desc: "800 g entre carne y pollo, tomate, lechuga, tocineta, queso rallado, papas y salsas." },
   { name: "Pepito 1 Metro Mega Full", price: 49,
     desc: "800 g entre carne y pollo, doble tocineta, tomate, lechuga, maíz, jamón ahumado, queso amarillo en lonjas, queso rallado, papas y salsas." },
  ]
 },
 {
  id: "hamburguesas", label: "Hamburguesas", emoji: "🍔",
  note: "🍞 Puedes cambiar el pan de trigo por pan de batata. Lo eliges al agregar tu hamburguesa.",
  items: [
   { name: "Normal", variants: mg(6, 7), options: [PROT(), PAN],
     desc: "Vegetales, papitas, queso cheddar, maíz y salsas." },
   { name: "Especial", variants: mg(8, 9), options: [PROT(), PAN],
     desc: "Vegetales, papitas, jamón, queso amarillo, tocineta, maíz y salsas." },
   { name: "Especial Mixta (2 proteínas)", variants: mg(9, 11.5), options: [PROT2, PAN],
     desc: "Vegetales, full tocineta, salsas, queso amarillo en lonja, jamón, papitas y maíz." },
   { name: "Súper Especial", variants: mg(9.5, 10.5), options: [PROT(), PAN],
     desc: "Vegetales, papas, tocineta, maíz, queso amarillo, jamón, huevo, queso cheddar y salsas." },
   { name: "Súper Especial Mixta (2 proteínas)", variants: mg(10, 12.5), options: [PROT2, PAN],
     desc: "Vegetales, full tocineta, queso cheddar, salsas, queso amarillo, jamón, papitas, huevo y maíz." },
   { name: "Mega Triple", variants: mg(10, 12.5), options: [PAN],
     desc: "Carne, pollo y chuleta, vegetales, full tocineta, queso amarillo, maíz, jamón, papitas y salsas." },
   { name: "Súper Mega Triple", variants: mg(11, 13.5), options: [PAN],
     desc: "Carne, pollo y chuleta, vegetales, full tocineta, huevo, jamón, queso amarillo, queso cheddar, papitas y salsas." },
   { name: "Americana", variants: mg(7, 9), options: [CEBOLLA, PAN],
     desc: "Incluye papas fritas (Mini 100 g · Grande 120 g). Carne, vegetales, full tocineta, queso cheddar y pepinillo." },
   { name: "Pollo Crispy", variants: mg(7, 9), options: [CEBOLLA, PAN],
     desc: "Incluye papas fritas (Mini 100 g · Grande 120 g). Pollo crispy, vegetales, full tocineta, queso cheddar y pepinillo." },
  ]
 },
 {
  id: "perros-calientes", label: "Perros Calientes", emoji: "🌭",
  items: [
   { name: "Perro Normal (salchicha)", price: 2.5,
     desc: "Salchicha, repollo, papitas, salsas y queso rallado." },
   { name: "Perro Especial (salchicha)", price: 6,
     desc: "Salchicha, repollo, papitas, jamón, queso amarillo, maíz, tocineta y salsas." },
   { name: "Perro Normal", price: 6, options: [PROT(["Pollo", "Carne", "Mixto"])],
     desc: "Repollo, papitas, salsas y queso rallado." },
   { name: "Perro Especial", price: 8, options: [PROT(["Pollo", "Carne", "Mixto"])],
     desc: "Repollo, papitas, jamón, queso amarillo, maíz, tocineta y salsas." },
   { name: "Perro Polaco Normal", price: 5,
     desc: "Salchicha polaca, repollo, papitas, salsas y queso rallado." },
   { name: "Perro Polaco Especial", price: 8,
     desc: "Salchicha polaca, repollo, papitas, jamón, queso amarillo, maíz, tocineta y salsas." },
  ]
 },
 {
  id: "pollo-broaster", label: "Pollo Broaster", emoji: "🍗",
  note: "Todos incluyen ensalada rallada, papas fritas y pan.",
  items: [
   { name: "Pollo Broaster 2 Piezas", price: 8, desc: "Con 200 g de papas fritas." },
   { name: "Pollo Broaster 4 Piezas", price: 12, desc: "Con 250 g de papas fritas." },
   { name: "Pollo Broaster 6 Piezas", price: 15, desc: "Con 250 g de papas fritas." },
   { name: "Pollo Broaster 8 Piezas", price: 18, desc: "Con 300 g de papas fritas." },
   { name: "Pollo Broaster Familiar 12 Piezas", price: 26, desc: "Con 400 g de papas fritas." },
  ]
 },
 {
  id: "tobo-tender", label: "Tobo Tender", emoji: "🍗",
  items: [
   { name: "1 Tobo Tender", price: 18, desc: "½ kg de pechuga, tequeños, papas, pan, salsas y ensalada." },
   { name: "½ Tobo Tender", price: 9.9, desc: "250 g de pechuga, tequeños, papas, pan, salsas y ensalada." },
  ]
 },
 {
  id: "alitas", label: "Alitas", emoji: "🍗",
  note: "Elige tu sabor: BBQ, mostaza miel, ajo-parmesano o picante.",
  items: [
   { name: "Alitas de 8 Piezas", price: 8.5, options: [SABOR], desc: "Con 150 g de papas fritas y 3 tequeños." },
   { name: "Alitas de 16 Piezas", price: 14, options: [SABOR], desc: "Con 250 g de papas fritas y 5 tequeños." },
   { name: "Alitas de 24 Piezas", price: 22, options: [SABOR], desc: "Con 500 g de papas fritas y 10 tequeños." },
   { name: "Alitas de 50 Piezas", price: 35, options: [SABOR], desc: "Con 600 g de papas fritas, 15 tequeños y bebida." },
  ]
 },
 {
  id: "club-house", label: "Club House", emoji: "🥪",
  items: [
   { name: "Club House Individual de Pollo", price: 13, options: [TOPPING],
     desc: "Pollo con 250 g de papas fritas, vegetales, queso amarillo, jamón de pierna y huevo." },
   { name: "Club House Individual de Chuleta", price: 14, options: [TOPPING],
     desc: "Chuleta con 250 g de papas fritas, vegetales, queso amarillo, jamón de pierna y huevo." },
   { name: "Club House Individual Mixto", price: 15, options: [TOPPING],
     desc: "Pollo y chuleta, 250 g de papas fritas, vegetales, queso amarillo, jamón de pierna y huevo." },
   { name: "Club House Familiar Mixto", price: 23, options: [TOPPING],
     desc: "Jamón de pierna, queso amarillo, huevo, pollo, chuleta, tomate, lechuga, tocineta y 400 g de papas fritas." },
   { name: "Sándwich de Pollo", price: 5,
     desc: "Milanesa de pollo, jamón de pierna, queso amarillo, vegetales y salsa." },
  ]
 },
 {
  id: "burrito", label: "Burritos", emoji: "🌯",
  items: [
   { name: "Burrito Carne", price: 9,
     desc: "Carne, vegetales, maíz, jamón, queso amarillo en lonja, queso amarillo rallado, tocineta, salsas y 150 g de papas fritas." },
   { name: "Burrito Pollo", price: 9,
     desc: "Pollo, vegetales, maíz, jamón, queso amarillo en lonjas, queso amarillo rallado, tocineta, salsas y 150 g de papas fritas." },
   { name: "Burrito Mixto", price: 9,
     desc: "Carne y pollo, vegetales, maíz, jamón, queso amarillo en lonja, queso amarillo rallado, tocineta, salsas y 150 g de papas fritas." },
   { name: "Burrito Mixto sin Papa", price: 7,
     desc: "Carne y pollo, vegetales, maíz, jamón, queso amarillo en lonja, queso amarillo rallado, tocineta y salsas." },
  ]
 },
 {
  id: "granjeros", label: "Granjeros", emoji: "🥖",
  items: [
   { name: "Pan de Orégano", price: 9,
     options: [{ key: "base", label: "Base", values: [{ label: "Crema de pollo" }, { label: "Crema de atún" }] }],
     desc: "Tomate, lechuga, cebolla, aceitunas negras, pepinillos, pimentón, jalapeño, maíz, pepino y queso cheddar." },
  ]
 },
 {
  id: "parrillas", label: "Parrillas", emoji: "🥩",
  items: [
   { name: "Parrilla Mixta", price: 13, options: [PROT(["Carne", "Pollo"])],
     desc: "300 g de carne o pollo, 300 g de papas fritas, ensalada mixta, queso llanero y guasacaca de la casa." },
   { name: "Súper Mega Parrilla", price: 15,
     desc: "300 g de carne, pollo y chorizo, 300 g de papas fritas, ensalada mixta, queso llanero y guasacaca de la casa." },
  ]
 },
 {
  id: "entradas", label: "Entradas", emoji: "🍟",
  items: [
   { name: "Tequeños con salsa de queso", desc: "Elige 5, 10 o 20 piezas.", variantLabel: "Cantidad",
     variants: [{ label: "5 piezas", price: 5 }, { label: "10 piezas", price: 8 }, { label: "20 piezas", price: 14 }] },
   { name: "Ración de 20 Tequeños Full Queso", price: 18 },
   { name: "Ración de Papas Pequeñas", price: 5 },
   { name: "Ración de Papas grandes", price: 8 },
   { name: "Papas de 150g", price: 3 },
   { name: "Salchipapas", desc: "Salchichas, pollo, carne, papas fritas, salsas y queso amarillo.",
     variants: [{ label: "Pequeña", price: 7 }, { label: "Grande", price: 10 }] },
   { name: "Ración de Nuggets", price: 6, desc: "6 piezas de nuggets de pollo + papas fritas." },
   { name: "Súper Combo 2 en 1 Crispy", price: 8.5, desc: "150 g de papas crispy + vaso de Nestea." },
   { name: "Súper Combo 2 en 1 Tocineta", price: 8.5, desc: "150 g de papas con tocineta + vaso de Nestea." },
   { name: "Súper Combo 2 en 1 Salchipapa", price: 8.5, desc: "150 g de salchipapa + vaso de Nestea." },
   { name: "Topping Carne", price: 3 },
   { name: "Topping Pollo", price: 3 },
  ]
 },
 {
  id: "pizza-pequeña", label: "Pizza Pequeña", emoji: "🍕",
  items: [
   { name: "Pequeña Clásica", price: 4.99 },
   { name: "Pequeña Corriente", price: 4.99 },
   { name: "Pequeña Especial", price: 5.99 },
   { name: "Pequeña Pepperoni", price: 5.99 },
   { name: "Pequeña Vegetariana", price: 5.99 },
   { name: "Pequeña Mega Pizza", price: 9.99 },
   { name: "Pequeña Charcutera", price: 9.99 },
  ]
 },
 {
  id: "pizza-mediana", label: "Pizza Mediana", emoji: "🍕",
  items: [
   { name: "Mediana Vegetariana", price: 8.99 },
   { name: "Mediana Mega Pizza", price: 17.99 },
   { name: "Mediana Charcutera", price: 17.99 },
   { name: "Mediana Clásica", price: 7.99 },
   { name: "Mediana Corriente", price: 7.99 },
   { name: "Mediana Especial", price: 8.99 },
   { name: "Mediana Pepperoni", price: 8.99 },
  ]
 },
 {
  id: "pizza-familiar", label: "Pizza Familiar", emoji: "🍕",
  items: [
   { name: "Familiar Clásica", price: 10.99 },
   { name: "Familiar Corriente", price: 10.99 },
   { name: "Familiar Especial", price: 12.99 },
   { name: "Familiar Pepperoni", price: 12.99 },
   { name: "Familiar Vegetariana", price: 12.99 },
   { name: "Familiar Mega Pizza", price: 24.99 },
   { name: "Familiar Charcutera", price: 24.99 },
  ]
 },
 {
  id: "pizzas", label: "Arma tu pizza", emoji: "🍕",
  note: "La pizza base es de 22 cm. Los primeros 4 ingredientes están incluidos; cada ingrediente adicional suma $1.",
  items: [
   { name: "Arma tu pizza", desc: "Base de 22 cm. Elige tu base y agrega los ingredientes que quieras.",
     variantLabel: "Base",
     variants: [
       { label: "Pizza básica", price: 6.9, desc: "Salsa y queso mozzarella" },
       { label: "Pizza con borde", price: 8.9, desc: "Salsa, queso mozzarella y borde de queso" },
     ],
     options: [{ key: "ing", label: "Ingredientes", multi: true, includedCount: 4, extraPrice: 1, values: PIZZA_INGREDIENTES }] },
  ]
 },
 {
  id: "combos", label: "Combos", emoji: "🔥",
  items: [
   { name: "Combo 4 Perro + Bebida", price: 7 },
   { name: "Perro Promo grande", price: 1.5 },
   { name: "Combo 4 Mini + Bebida", price: 11 },
   { name: "Mini Promoción", price: 3 },
   { name: "Pizza 2 Pepperoni + Bebida", price: 12.99 },
   { name: "Pizza 2 Especiales + Bebida", price: 12.99 },
  ]
 },
 {
  id: "promociones", label: "Promociones", emoji: "🔥",
  items: [
   { name: "Promoción 2 Pizzas", price: 6.5 },
   { name: "Promoción 3 Pizzas", price: 9.5 },
   { name: "Promoción 1 Pizza", price: 3.5 },
  ]
 },
 {
  id: "menu-infantil", label: "Menú Infantil", emoji: "🧒",
  items: [
   { name: "Menú Infantil #1 Mini", price: 7, desc: "Mini infantil de carne, papas fritas y bebida." },
   { name: "Menú Infantil #2 Nuggets", price: 7, desc: "6 raciones de nuggets de pollo, papas fritas y bebida." },
   { name: "Menú Kid #1 con obsequio", price: 8.5, desc: "Mini infantil de carne, papas fritas, bebida y obsequio sorpresa." },
   { name: "Menú Kid #2 Nuggets con obsequio", price: 8.5, desc: "6 raciones de nuggets de pollo, papas fritas, bebida y obsequio sorpresa." },
   { name: "Menú Kid #1 Colección Mario", price: 12, desc: "Mini infantil de carne, papas fritas, bebida y obsequio." },
   { name: "Menú Kid #2 Colección Mario Nuggets", price: 12, desc: "6 raciones de nuggets de pollo, papas fritas, bebida y obsequio." },
  ]
 },
 {
  id: "menu-fitnees", label: "Menú Fit", emoji: "🥗",
  items: [
   { name: "Burrito Fit", price: 6, kcal: "550–650 kcal", options: [PROT(["Carne", "Pollo", "Mixto"])],
     desc: "200 g de proteína, lechuga, tomate, cebolla y tocineta. Incluye 1 porción de yogurt griego." },
   { name: "Ensalada Fit", price: 8, kcal: "550–650 kcal",
     desc: "350 g de proteína, 1 huevo, lechuga, tomate y cebolla." },
   { name: "Hamburguesa Keto", price: 8, kcal: "350–450 kcal", options: [PROT()],
     desc: "Base de lechuga, proteína, tomate, cebolla, huevo y tocineta." },
   { name: "Hamburguesa Keto Mixta 2 proteínas", price: 9.5, kcal: "350–450 kcal", options: [PROT2],
     desc: "Base de lechuga, 2 proteínas, tomate, cebolla, huevo y tocineta." },
   { name: "Hamburguesa Keto Triple", price: 11.5,
     desc: "Base de lechuga, 3 proteínas, tomate, cebolla, huevo y tocineta." },
   { name: "Yogurt Griego", kcal: "Pequeño 250–350 kcal · Grande 400–500 kcal",
     desc: "Con toppings de frutas o granola, y miel o sirope de fresa.",
     variants: [{ label: "Pequeño", price: 3.5, desc: "250–350 kcal" }, { label: "Grande", price: 4.5, desc: "400–500 kcal" }],
     options: [
       { key: "top", label: "Topping", values: [{ label: "Frutas" }, { label: "Granola" }] },
       { key: "dulce", label: "Endulzante", values: [{ label: "Miel" }, { label: "Sirope de fresa" }] },
     ] },
  ]
 },
 {
  id: "ensalada-cesar", label: "Ensalada César", emoji: "🥗",
  note: "Todas con salsa de la casa.",
  items: [
   { name: "César Clásica", price: 7, desc: "Trozos de pan, lechuga, tocineta y queso parmesano." },
   { name: "César con Pollo a la plancha", price: 9, desc: "Trozos de pan, pollo, lechuga, tocineta y queso parmesano." },
   { name: "César con Pollo Crispy", price: 9, desc: "Trozos de pan, pollo crispy, lechuga, tocineta y queso parmesano." },
  ]
 },
 {
  id: "bebidas", label: "Bebidas", emoji: "🥤",
  items: [
   { name: "Coca-Cola o Pepsi", variantLabel: "Tamaño",
     variants: [{ label: "400 ml", price: 1 }, { label: "1 L", price: 2 }, { label: "1.5 L", price: 2.5 }, { label: "2 L", price: 3 }],
     options: [{ key: "marca", label: "Marca", bare: true, values: [{ label: "Coca-Cola" }, { label: "Pepsi" }] }] },
   { name: "Glup", variantLabel: "Tamaño",
     variants: [{ label: "400 ml", price: 0.5 }, { label: "1 L", price: 1.5 }, { label: "2 L", price: 2 }] },
   { name: "Nestea", variantLabel: "Tamaño",
     variants: [{ label: "Pequeño", price: 2 }, { label: "Grande", price: 3 }] },
   { name: "Coca-Cola 350 ml", price: 1 },
   { name: "Lata Pepsi", price: 2.5 },
   { name: "Refresco Botella", price: 1 },
   { name: "Jugos Yusty", price: 1 },
   { name: "Yuky Pak", price: 1.5 },
   { name: "Malta de Lata", price: 1.5 },
   { name: "Agua Aguafiel", price: 1 },
   { name: "Agua Nevada 355 ml", price: 1.5 },
   { name: "Agua Minalba 600ml", price: 1.5 },
  ]
 },
 {
  id: "extras", label: "Extras", emoji: "➕",
  items: [
   { name: "Huevo", price: 0.5 },
   { name: "Salchicha de Pollo", price: 0.5 },
   { name: "Ensalada Broaster", price: 1 },
   { name: "Pepinillo", price: 1 },
   { name: "Anchoa", price: 1 },
   { name: "Extra de Maíz", price: 1.5 },
   { name: "Jamón Ahumado", price: 1.5 },
   { name: "Facilita", price: 1.5 },
   { name: "Queso Amarillo", price: 1.5 },
   { name: "Extra Tocineta", price: 2 },
   { name: "Pepperoni", price: 2 },
   { name: "Milanesa Crispy grande", price: 2 },
   { name: "Carne 130 g", price: 2 },
   { name: "Milanesa", price: 2 },
   { name: "Borde de Mozzarella", price: 2 },
   { name: "Salchicha Polaca", price: 2.5 },
   { name: "Chuleta", price: 3 },
   { name: "Topping Mixto", price: 3 },
  ]
 },
 {
  id: "salsas", label: "Salsas", emoji: "🥫",
  items: [
   { name: "Vasitos con Salsa", price: 0.5 },
  ]
 }
];
