import { ClassContent } from "../types/ClassContent";

export const classesMock: ClassContent[] = [
  {
    id: "12354",
    classNumber: "Aula 1",
    teacher: "Gustavo",
    title: "Introdução ao UX",
    image: "/classes/banner-aula-1.png",
    content: [
      { type: "title", value: "O que é UX" },
      { type: "text", value: "UX trata da experiência do usuário ao interagir com um produto." },
      { type: "subtitle", value: "Conceitos iniciais" },
      { type: "text", value: "Usabilidade, acessibilidade e satisfação." },
      { type: "link", value: "https://www.nngroup.com" },
    ],
  },
  {
    id: "012365",
    classNumber: "Aula 2",
    teacher: "Gustavo",
    title: "Pesquisa com Usuários",
    image: "/classes/banner-aula-1.png",
    content: [
      { type: "title", value: "Pesquisa Qualitativa" },
      { type: "text", value: "Entrevistas ajudam a entender necessidades reais." },
      { type: "subtitle", value: "Quando pesquisar" },
      { type: "text", value: "Antes de qualquer decisão de produto." },
      { type: "link", value: "https://www.interaction-design.org" },
    ],
  },
  {
    id: "123146",
    classNumber: "Aula 3",
    teacher: "Gustavo",
    title: "Arquitetura da Informação",
    image: "/classes/banner-aula-1.png",
    content: [
      { type: "title", value: "Organização de Conteúdo" },
      { type: "text", value: "Estruturar bem facilita a navegação." },
      { type: "subtitle", value: "Hierarquia" },
      { type: "text", value: "Informações mais importantes vêm primeiro." },
      { type: "link", value: "https://www.usability.gov" },
    ],
  },
  {
    id: "5461423",
    classNumber: "Aula 4",
    teacher: "Gustavo",
    title: "Wireframes",
    image: "/classes/banner-aula-1.png",
    content: [
      { type: "title", value: "O que são Wireframes" },
      { type: "text", value: "São representações estruturais de interfaces." },
      { type: "subtitle", value: "Baixa fidelidade" },
      { type: "text", value: "Foco em estrutura, não em visual." },
      { type: "link", value: "https://www.figma.com" },
    ],
  },
  {
    id: "214654",
    classNumber: "Aula 5",
    teacher: "Gustavo",
    title: "User Flow",
    image: "/classes/banner-aula-1.png",
    content: [
      { type: "title", value: "Introdução ao User Flow" },
      { type: "text", value: "User Flow representa o caminho do usuário." },
      { type: "subtitle", value: "Benefícios" },
      { type: "text", value: "Ajuda a mapear decisões e pontos de fricção." },
      { type: "link", value: "https://www.figma.com" },
    ],
  },
];