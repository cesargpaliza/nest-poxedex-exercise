import { Controller, Get } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { PokeapiResponse } from './interfaces/poke-response';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Controller('seed')
export class SeedController {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  private readonly axios: AxiosInstance;

  @Get()
  async executeSeed() {

    //borra toda la DB
    await this.pokemonModel.deleteMany()

    const url = 'https://pokeapi.co/api/v2/pokemon?limit=500'
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json()
    // forma 2
    // const insertPromisesArray = []

    const pokemonToInsert: { name: string, no: number}[] = [] 


    result.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      // forma 1 insert in DB
      // const pokemon = await this.pokemonModel.create({name, no})
      // forma2
      // insertPromisesArray.push(this.pokemonModel.create({name,no}))
      // forma 3
      pokemonToInsert.push({name,no})

    });

    //forma 2
    //await Promise.all(insertPromisesArray)

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'SeedExecuted';
  }
}
