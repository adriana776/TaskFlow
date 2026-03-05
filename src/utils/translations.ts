export const translations: Record<number, string> = {
    1: "Hacer algo agradable por alguien que te importa",
    2: "Memorizar un poema",
    3: "Ver una película clásica",
    4: "Contribuir a un proyecto de código abierto",
    5: "Resolver un cubo Rubik",
    6: "Leer un libro de no ficción",
    7: "Preparar una nueva receta",
    8: "Visitar un museo local",
    9: "Aprender 5 palabras en otro idioma",
    10: "Ver un documental",
    11: "Practicar meditación por 10 minutos",
    12: "Escribir en un diario personal",
    13: "Hacer ejercicio por 30 minutos",
    14: "Llamar a un amigo o familiar",
    15: "Organizar tu espacio de trabajo",
    16: "Aprender algo nuevo en YouTube",
    17: "Cocinar una comida saludable",
    18: "Salir a caminar al aire libre",
    19: "Leer las noticias del día",
    20: "Planificar la semana",
    21: "Revisar tus metas personales",
    22: "Hacer una lista de compras",
    23: "Escuchar un podcast educativo",
    24: "Practicar un instrumento musical",
    25: "Ordenar tu correo electrónico",
    26: "Hacer una donación benéfica",
    27: "Aprender a hacer origami",
    28: "Tomar fotos creativas",
    29: "Escribir una carta de agradecimiento",
    30: "Plantar una semilla o cuidar una planta"
};

export const translateTask = (id: number, fallback: string): string => {
    return translations[id] || fallback;
};
