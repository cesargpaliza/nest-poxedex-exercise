import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    /* Se carga la conexion a la base de datos
    mediante injeccion de dependicias */
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    //Si el id es un numero
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    //Si es MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //Por ultimo buscamos si es la busqueda es por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }
    if (!pokemon) throw new NotFoundException(`Pokemon with id, not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }
    try {
      // si segundo param es { new: true } -> retorna el nuevo objeto
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    //* Eliminacion recibiendo cualquier id (name, no, id)
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //* borrar por id ya validado desde pipe
    //const result = await this.pokemonModel.findByIdAndDelete(id)
    
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id})
    if(deletedCount === 0) throw new BadRequestException(`Pokemon not found`)
    return 
  }

  private handleExceptions (error: any) {
    if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db`);
      }
      console.log(error);
      throw new InternalServerErrorException(
        `Can´t create Pokemon, check server logs`,
      );
  }

}
