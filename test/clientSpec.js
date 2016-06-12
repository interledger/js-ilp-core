'use strict'

const sinon = require('sinon')
const assert = require('chai').assert
const mockRequire = require('mock-require')

const ilpCore = require('..')
const Client = ilpCore.Client
const Payment = ilpCore.Payment
const MockPlugin = require('./mocks/mock-plugin')

describe('Client', function () {
  beforeEach(function () {
    mockRequire('ilp-plugin-mock', MockPlugin)
  })

  afterEach(function () {
    mockRequire.stopAll()
  })

  describe('constructor', function () {
    it('should instantiate the ledger plugin', function () {
      const client = new Client({
        type: 'mock'
      })

      assert.instanceOf(client, Client)
      assert.instanceOf(client.getPlugin(), MockPlugin)
    })

    it('should fail if the ledger plugin does not exist', function () {
      assert.throws(() => {
        return new Client({
          type: 'fake',
          auth: {
            mock: true
          }
        })
      }, 'Cannot find module \'ilp-plugin-fake\'')
    })
  })

  describe('connect', function () {
    it('should call connect on the plugin', function * () {
      const client = new Client({
        type: 'mock'
      })
      const stubConnect = sinon.stub(client.getPlugin(), 'connect')

      client.connect()

      sinon.assert.calledOnce(stubConnect)
      stubConnect.restore()
    })
  })

  describe('disconnect', function () {
    it('should call disconnect on the plugin', function * () {
      const client = new Client({
        type: 'mock'
      })
      const stubDisconnect = sinon.stub(client.getPlugin(), 'disconnect')

      client.disconnect()

      sinon.assert.calledOnce(stubDisconnect)
      stubDisconnect.restore()
    })
  })

  describe('fulfillCondition', function () {
    it('should call fulfillCondition on the plugin', function * () {
      const client = new Client({
        type: 'mock'
      })
      const stubDisconnect = sinon.stub(client.getPlugin(), 'fulfillCondition')

      client.fulfillCondition({ foo: true }, 'cf:0:')

      sinon.assert.calledOnce(stubDisconnect)
      sinon.assert.calledWith(stubDisconnect, { foo: true }, 'cf:0:')
      stubDisconnect.restore()
    })
  })

  describe('createPayment', function () {
    beforeEach(function () {
      this.client = new Client({
        type: 'mock'
      })
    })

    it('should create a new Payment object', function () {
      const payment = this.client.createPayment({
        destinationAmount: '1',
        destinationAccount: 'https://red.ilpdemo.org/ledger/accounts/alice',
        destinationLedger: 'https://red.ilpdemo.org/ledger'
      })

      assert.instanceOf(payment, Payment)
    })
  })
})