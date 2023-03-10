
const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const config = require('./config')

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

// Route Home
    // Get method
app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/signup.html')
})

    // Post method
app.post('/', (req, res)=>{
    const {nName, email }= req.body
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: nName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    // Mailchimp List Id
    const url = `https://us21.api.mailchimp.com/3.0/lists/${config.env.list}`

    // Mailchimp API
    const options = {
        method: "POST",
        auth: `${config.env.user}:${config.env.key}`
    }

    const request = https.request(url, options, (response)=>{
        
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }
        
        response.on("data", (data)=>{
            console.log(JSON.parse(data))
        })
    })    

    request.write(jsonData)
    request.end()
})

// Route Failure
// Post method
app.post('/failure', (req, res)=>{
    res.redirect('/')
})


// Spin up server
app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server Up')
})
