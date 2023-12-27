import fastify from "fastify";
import { request } from "http";
import { users } from './User'
import { DataSource,DeepPartial} from 'typeorm';
import 'reflect-metadata'

const app=fastify();



const appdatasource=new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username:"postgres",
    password:"Asghar@123",
    database:"crudapi",
    entities: [users],
})

const port =3000;

appdatasource.initialize().then(()=>{
    console.log("Database Connected Successfully");
}).catch((err)=>console.log(err));


app.get('/', async (request, reply) => {
    try{
const userRepository = appdatasource.getRepository(users);
    const user = await userRepository.find();
    reply.send(user);
    }catch(err){
        console.log(err);
    }
  });
  
  app.post('/user', async (request, reply) => {
    try{
    const userRepository = appdatasource.getRepository(users);
    const newUser = userRepository.create(request.body as DeepPartial<users>);
    const savedUser = await userRepository.save(newUser);
    reply.send(savedUser);
    }catch(err){
        console.log(err);
    }
  });


  app.put('/user/:id', async (request, reply) => {
try{
    const params = request.params as { id: number };
    const userId= (params.id);
    const userRepository = appdatasource.getRepository(users);
    const user = await userRepository.findOneOrFail({where:{id:userId}});
    userRepository.merge(user,request.body as DeepPartial<users>);
    const updatedUser = await userRepository.save(user)
    reply.send(updatedUser);
}catch(err){
    console.log(err);
}
  })

  
  app.delete('/users/:id', async (request, reply) => {
    try{
    const params = request.params as { id: number };
    const userId= (params.id);
    const userRepository = appdatasource.getRepository(users);
    const user = await userRepository.findOneOrFail({where:{id:userId}});
    reply.send(user)
    await userRepository.remove(user);
    reply.send('User deleted successfully' );
    }catch(err){
        console.log(err);
    }
  });



app.listen({port:3000},(err,address)=>{
    if(!err){
        console.log(`App is lisning on ${port}`);
    }
    else{
console.log(err)
    }
})

