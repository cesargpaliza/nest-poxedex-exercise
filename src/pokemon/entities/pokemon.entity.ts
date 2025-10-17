import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

//Esquema que relaciona mongo con nest
@Schema()
export class Pokemon extends Document {
  
  // id es otorgado por mongo
  @Prop({
    unique: true,
    index: true
  })
  name: string

  @Prop({
    unique: true,
    index: true
  })
  no: number
}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon )