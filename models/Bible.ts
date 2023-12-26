export default class Bible {
  id: string;
  abbreviation: string;
  abbreviationLocal: string;
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  type: string;

  constructor(
    id: string,
    abbreviation: string,
    abbreviationLocal: string,
    name: string,
    nameLocal: string,
    description: string,
    descriptionLocal: string,
    type: string
  ) {
    this.id = id;
    this.abbreviation = abbreviation;
    this.abbreviationLocal = abbreviationLocal;
    this.name = name;
    this.nameLocal = nameLocal;
    this.description = description;
    this.descriptionLocal = descriptionLocal;
    this.type = type;
  }

  static fromJsonString(jsonString: string): Bible {
    const json = JSON.parse(jsonString);
    return new Bible(
      json.id,
      json.abbreviation,
      json.abbreviationLocal,
      json.name,
      json.nameLocal,
      json.description,
      json.descriptionLocal,
      json.type
    );
  }
}
