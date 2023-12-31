const userModel = require ('../model/userModual.cjs')
const bcrypt = require ('bcryptjs') //hashedPassword

const jwt = require ('jsonwebtoken')

exports.register = async function (req, res) {
    try {
        let newUser = new userModel(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        newUser.password = hashedPassword
        let user = await newUser.save()
        return res.json({ message: "User register Succesfuly", user: { name: user.name, email: user.email, id: user._id} })
    } catch (err) {
        return res.status(400).send({ message: "err"}) 
    }
}

exports.login = async function (req, res) {
    try {
       
        let user = await userModel.findOne({email:req.body.email })
        
        if (!user || !user.comparePassword(req.body.password)) {
      
            return res.status(401).json({message: "Authnication Failed , Invalid username or password" })
        }
        const token = jwt.sign({ name: user.name, email: user.email, id: user._id} ,  'secuirtkey' )
        return res.json({ message: "User Loged Succesfuly", user: { name: user.name, email: user.email, id: user._id, token:token } })
    } catch (err) {
        return res.status(400).send({ message: "err" }) 
    }

}

