export interface IPropertyInfo {
  name: string;
  color: string;
  price: number;
  hex: string;
}

export interface IPropertyInfoExtended extends IPropertyInfo {
  shortName: string;
  colorLabel: string;
}

export const propertyGroups: IPropertyInfo[] = [
  { name: "Café-Marrón Solar 1 o 2 ($60)", color: "brown", price: 60, hex: "#955436" },
  { name: "Celeste Solar 1 o 2 ($100)", color: "light-blue", price: 100, hex: "#aae0fa" },
  { name: "Celeste Solar 3 ($120)", color: "light-blue", price: 120, hex: "#aae0fa" },
  { name: "Lila/Morado Solar 1 o 2 ($140)", color: "pink", price: 140, hex: "#d93a96" },
  { name: "Lila/Morado Solar 3 ($160)", color: "pink", price: 160, hex: "#d93a96" },
  { name: "Naranja Solar 1 o 2 ($180)", color: "orange", price: 180, hex: "#f19122" },
  { name: "Naranja Solar 3 ($200)", color: "orange", price: 200, hex: "#f19122" },
  { name: "Rojo Solar 1 o 2 ($220)", color: "red", price: 220, hex: "#e21123" },
  { name: "Rojo Solar 3 ($240)", color: "red", price: 240, hex: "#e21123" },
  { name: "Amarillo Solar 1 o 2 ($260)", color: "yellow", price: 260, hex: "#fedf00" },
  { name: "Amarillo Solar 3 ($280)", color: "yellow", price: 280, hex: "#fedf00" },
  { name: "Verde Solar 1 o 2 ($300)", color: "green", price: 300, hex: "#1fb25a" },
  { name: "Verde Solar 3 ($320)", color: "green", price: 320, hex: "#1fb25a" },
  { name: "Azul Solar 1 ($350)", color: "dark-blue", price: 350, hex: "#0072bb" },
  { name: "Azul Solar 2 ($400)", color: "dark-blue", price: 400, hex: "#0072bb" },
  { name: "Estaciones-Ferrocarriles ($200)", color: "stations", price: 200, hex: "#000000" },
  { name: "Servicios Públicos ($150)", color: "utilities", price: 150, hex: "#e6ffcc" }
];

// 28 propiedades individuales para el inventario de fin de partida
export const allProperties: IPropertyInfoExtended[] = [
  { name: "Café-Marrón Solar 1", shortName: "Café 1", color: "brown", colorLabel: "Café", price: 60, hex: "#955436" },
  { name: "Café-Marrón Solar 2", shortName: "Café 2", color: "brown", colorLabel: "Café", price: 60, hex: "#955436" },
  { name: "Celeste Solar 1", shortName: "Celeste 1", color: "light-blue", colorLabel: "Celeste", price: 100, hex: "#aae0fa" },
  { name: "Celeste Solar 2", shortName: "Celeste 2", color: "light-blue", colorLabel: "Celeste", price: 100, hex: "#aae0fa" },
  { name: "Celeste Solar 3", shortName: "Celeste 3", color: "light-blue", colorLabel: "Celeste", price: 120, hex: "#aae0fa" },
  { name: "Lila/Morado Solar 1", shortName: "Lila 1", color: "pink", colorLabel: "Lila", price: 140, hex: "#d93a96" },
  { name: "Lila/Morado Solar 2", shortName: "Lila 2", color: "pink", colorLabel: "Lila", price: 140, hex: "#d93a96" },
  { name: "Lila/Morado Solar 3", shortName: "Lila 3", color: "pink", colorLabel: "Lila", price: 160, hex: "#d93a96" },
  { name: "Naranja Solar 1", shortName: "Naranja 1", color: "orange", colorLabel: "Naranja", price: 180, hex: "#f19122" },
  { name: "Naranja Solar 2", shortName: "Naranja 2", color: "orange", colorLabel: "Naranja", price: 180, hex: "#f19122" },
  { name: "Naranja Solar 3", shortName: "Naranja 3", color: "orange", colorLabel: "Naranja", price: 200, hex: "#f19122" },
  { name: "Rojo Solar 1", shortName: "Rojo 1", color: "red", colorLabel: "Rojo", price: 220, hex: "#e21123" },
  { name: "Rojo Solar 2", shortName: "Rojo 2", color: "red", colorLabel: "Rojo", price: 220, hex: "#e21123" },
  { name: "Rojo Solar 3", shortName: "Rojo 3", color: "red", colorLabel: "Rojo", price: 240, hex: "#e21123" },
  { name: "Amarillo Solar 1", shortName: "Amarillo 1", color: "yellow", colorLabel: "Amarillo", price: 260, hex: "#fedf00" },
  { name: "Amarillo Solar 2", shortName: "Amarillo 2", color: "yellow", colorLabel: "Amarillo", price: 260, hex: "#fedf00" },
  { name: "Amarillo Solar 3", shortName: "Amarillo 3", color: "yellow", colorLabel: "Amarillo", price: 280, hex: "#fedf00" },
  { name: "Verde Solar 1", shortName: "Verde 1", color: "green", colorLabel: "Verde", price: 300, hex: "#1fb25a" },
  { name: "Verde Solar 2", shortName: "Verde 2", color: "green", colorLabel: "Verde", price: 300, hex: "#1fb25a" },
  { name: "Verde Solar 3", shortName: "Verde 3", color: "green", colorLabel: "Verde", price: 320, hex: "#1fb25a" },
  { name: "Azul Solar 1", shortName: "Azul 1", color: "dark-blue", colorLabel: "Azul Osc", price: 350, hex: "#0072bb" },
  { name: "Azul Solar 2", shortName: "Azul 2", color: "dark-blue", colorLabel: "Azul Osc", price: 400, hex: "#0072bb" },
  { name: "Estación 1", shortName: "Estac 1", color: "stations", colorLabel: "Estación", price: 200, hex: "#000000" },
  { name: "Estación 2", shortName: "Estac 2", color: "stations", colorLabel: "Estación", price: 200, hex: "#000000" },
  { name: "Estación 3", shortName: "Estac 3", color: "stations", colorLabel: "Estación", price: 200, hex: "#000000" },
  { name: "Estación 4", shortName: "Estac 4", color: "stations", colorLabel: "Estación", price: 200, hex: "#000000" },
  { name: "Servicio Agua", shortName: "Agua", color: "utilities", colorLabel: "Servicios", price: 150, hex: "#e6ffcc" },
  { name: "Servicio Luz", shortName: "Luz", color: "utilities", colorLabel: "Servicios", price: 150, hex: "#e6ffcc" }
];

// Agrupa propiedades por colorLabel
export interface IColorGroup {
  label: string;
  color: string;
  hex: string;
  properties: IPropertyInfoExtended[];
}

export const groupByColor = (): IColorGroup[] => {
  const map = new Map<string, IColorGroup>();
  allProperties.forEach(p => {
    if (!map.has(p.color)) {
      map.set(p.color, { label: p.colorLabel, color: p.color, hex: p.hex, properties: [] });
    }
    map.get(p.color)!.properties.push(p);
  });
  // Orden consistente: brown, light-blue, pink, orange, red, yellow, green, dark-blue, stations, utilities
  const order = ["brown", "light-blue", "pink", "orange", "red", "yellow", "green", "dark-blue", "stations", "utilities"];
  return order.map(c => map.get(c)!).filter(Boolean);
};

export const getPropertyByName = (name: string): IPropertyInfoExtended | undefined =>
  allProperties.find(p => p.name === name);

// Determina si el texto debe ser blanco o negro según el fondo
export const getTextColorForHex = (hex: string): string => {
  const lightColors = ["#aae0fa", "#fedf00", "#e6ffcc", "#f19122"];
  return lightColors.includes(hex) ? "#1e293b" : "#ffffff";
};
