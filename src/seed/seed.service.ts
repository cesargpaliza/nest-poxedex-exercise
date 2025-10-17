import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeapiResponse } from './interfaces/poke-response';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
    private readonly http2: FetchAdapter
  ) {}

  //definimos axios como atributo para mantenerlo fuera de la funcion, luego reemplazado por adapter
  private readonly axios: AxiosInstance;

  async executeSeed() {

    //borra toda la DB
    await this.pokemonModel.deleteMany()    
    const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon?limit=500'
    


    //* Paso 1: consultar api ------------------------------------------
    //? forma 1: Consultar con fetch
    // const response = await fetch(url);
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`);
    // }
    // const data = await response.json()

    //? forma 2: Consultar con axios
    //const { data } = this.axios.get<PokeapiResponse>(url)
    
    //? forma 3: Con adaptater [correcta]
    //const data = await this.http.get<PokeapiResponse>(POKEAPI_URL)

    //? forma 4: Con nuevo adapter de fetch
    const data = await this.http2.get<PokeapiResponse>(POKEAPI_URL)


    
    //* Paso 2: preparar y realizar insercion --------------------------
    // forma 2
    // const insertPromisesArray = []
    const pokemonToInsert: { name: string, no: number}[] = [] 

    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      //? forma 1 insert in DB
      // const pokemon = await this.pokemonModel.create({name, no})
      //? forma2
      // insertPromisesArray.push(this.pokemonModel.create({name,no}))
      //? forma 3
      pokemonToInsert.push({name,no})

    });

    //forma 2
    //await Promise.all(insertPromisesArray)

    //forma 3
    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'SeedExecuted';
  }
}
