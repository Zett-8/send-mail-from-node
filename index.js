const experss = require('express')
const nodemailer = require('nodemailer')
const sendmail = require('sendmail')()
const config = require('./config')

const app = experss()

const PORT = process.env.PORT || '5000'

const defaultMail = {
  from: 'sample@com',
  to: 'youraddress@com',
  subject: 'Hi, it\'s me',
  text: 'this is message'
}

const sendWithSMTP = (req, res) => {
  const mail = req.body || defaultMail

  // if 2-factor auth is available on the account you need oauth2
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: config
  })

  transporter.sendMail(mail, (err) => {
    if (err) {
      console.log(err)
      res.status(400).send('error')
    }

    res.status(200).send('OK')
  })
}

const sendWithoutSMTP = (req, res) => {
  const mail = req.body || defaultMail

  sendmail(mail, (err) => {
    if (err) {
      console.log(err)
      res.status(400).send('error')
    }
    res.status(200).send('sent an email')
  })
}

app.use(experss.json())
app.get('/', (req, res) => res.send('hello world'))
app.post('/with-smtp', sendWithSMTP)
app.post('/without-smtp', sendWithoutSMTP)

app.listen(PORT, () => console.log(`running on ${PORT}`))
