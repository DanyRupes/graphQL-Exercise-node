const express = require('express')
const app = express()
const express_graphql = require('express-graphql')
const { buildSchema } = require('graphql')

let mongoPersons = [
    {id:1,firstName: 'User', lastName:'fineName  ',address:'a,11', phone:'1232321', mail:'On@gmail.com'},
    {id:2,firstName: 'User2', lastName:'fineName2',address:'b/22', phone:'2345345', mail:'fw@gmail.com'},
    {id:3,firstName: 'User3', lastName:'fineName3',address:'c/33', phone:'3543653', mail:'th@gmail.com'},
    {id:4,firstName: 'User4', lastName:'fineName4',address:'d/44', phone:'4354543', mail:'fo@gmail.com'},
    {id:5,firstName: 'User5', lastName:'fineName5',address:'e/55', phone:'5345435', mail:'fi@gmail.com'},
]

//type Query : for this schema and each requests which contains this data structure. 

// typeOfOperation { ClientKeyValue :  return type }
let PersonSchema = buildSchema(`
    type Query {    
        hello: String        
        allPersons : [Person]
        person (id : Int!): Person
    },
    type Mutation {
        updateOnePerson(id: Int!, firstName :String, lastName:String, address:String, mail:String, phone:Int) : Person
    },
    type Person {
        id: Int
        firstName : String
        lastName : String
        address: String
        mail: String
        phone: Int
    }
`)

let getAllPersons = function (req) {
    return mongoPersons
}

let getOnePerson = function(req){
    
   if(req.id){
       let onePerson = mongoPersons.filter(i=>i.id==req.id)
    //    console.log(onePerson)
       return onePerson[0]
   }
}


let updateOnePerson =async ({id, firstName, lastName, address, mail, phone }) =>{
    // console.log(id)

    let result = await mongoPersons.filter(per=>{
        let { firstName: fname, lastName:lname, address:addr, mail:ml, phone:ph } = per
        if(per.id==id) {
            per.firstName = firstName || fname
            per.lastName = lastName || lname
            per.address = address || addr
            per.mail = mail || ml
            per.phone = phone || ph
            return per
        }
    })
    // console.log(await result[0])
    return await result[0]
}

let root = {
    hello: () => 'Hello world!',
    allPersons : getAllPersons,
    person : getOnePerson,
    updateOnePerson
}


let personGraph = {
    schema: PersonSchema,
    rootValue: root ,
    graphiql: true 
}

app.use('/getAllPerson',express_graphql({
        schema: PersonSchema, // defined structure how API system will works. data and definition. each time client request will be validated
        rootValue: root , //what are the values will come and include 
        graphiql: true //see in browser .ide
    }))

app.use('/getOnePerson', express_graphql(personGraph))

app.use('/updateOneperson',express_graphql(personGraph))

app.listen(80)