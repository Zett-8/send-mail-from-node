const experss = require('express')
const nodemailer = require('nodemailer')
const sendmail = require('sendmail')()
const config = require('./config')

const app = experss()

const PORT = process.env.PORT || '5000'
const sender = 'sample@mail.com'
const receiver = 'youraddress@gmail.com'

const sendWithSMTP = (req, res) => {
  // if 2-factor auth is available on the account you need oauth2
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: config
  })

  const mail = {
    from: sender,
    to: receiver,
    subject: 'Hi, it\'s me',
    text: 'this is message'
  }

  transporter.sendMail(mail, (err) => {
    if (err) {
      console.log(err)
      res.status(400).send('error')
    }

    res.status(200).send('OK')
  })
}

const sendWithoutSMTP = (req, res) => {
  sendmail({
    from: sender,
    to: receiver,
    subject: 'title',
    text: 'hello world'
  }, (err) => {
    if (err) {
      console.log(err)
      res.status(400).send('error')
    }
    res.status(200).send('sent an email')
  })
}

app.get('/', (req, res) => res.send('hello world'))
app.get('/with-smtp', sendWithSMTP)
app.get('/without-smtp', sendWithoutSMTP)

app.listen(PORT, () => console.log(`running on ${PORT}`))
