const { CatalogItem } = require('../models/catItem.model')
const { ObjectID } = require('mongodb')

exports.generateCost = async (req, res) => {
  const answer = {}
  answer.totalCost = 0
  answer.totalTime = 0 // return as milliseconds
  const selectedItems = (answer.services = [])

  const { items } = req.query
  const selectedItemsIds = items.split(',')
  const vin = (answer.vin = req.params.vin)

  if (!vin)
    return res.status(400).send({ error: 'No VIN number provided in request.' })

  try {
    if (selectedItemsIds.length !== 0) {
      for (let item = 0; item < selectedItemsIds.length; item++) {
        const selectedItemId = selectedItemsIds[item]

        if (!ObjectID.isValid(selectedItemId))
          return res.status(400).send('Invalid ID')

        const selectedItem = await CatalogItem.findById(
          selectedItemId,
          'title price duration'
        )

        if (!selectedItem) continue
        selectedItems.push(selectedItem)
      }
    }
  } catch (error) {
    return res.status(400).send({ error })
  }

  if (selectedItems.length !== 0) {
    selectedItems.forEach(item => {
      answer.totalCost += item.price
      answer.totalTime += item.duration
    })
  }

  // if (answer.totalCost !== 0)
  // answer.totalCost = `$${Number.parseFloat(answer.totalCost / 100).toFixed(
  //   2
  // )}` // convert to dollars to return as cents

  return res.json(answer)
}
