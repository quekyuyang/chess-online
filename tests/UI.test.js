/**
 * @jest-environment jsdom
 */

//const createPickupEvent = require('../public/UI')
import {createPickupEvent} from "../public/UI.js"
import {show_moves} from "../public/render.js"


jest.mock("../public/render.js")


test('Pick up chess piece', () => {
  const elem = document.createElement("div")
  elem.id = '0'
  const width = 200
  const height = 100
  elem.getBoundingClientRect = jest.fn(() => {
    return {
      width: width,
      height: height
    }
  })

  const moves = {'0': [0]}
  const chessboard_elem = document.createElement("div")
  chessboard_elem.addEventListener = jest.fn()
  const pickup = createPickupEvent(elem, moves, chessboard_elem)
  elem.addEventListener("mousedown", pickup)
  elem.addEventListener = jest.fn()

  let event = new Event("mousedown")
  const pageX = 50
  const pageY = 70
  event.pageX = pageX
  event.pageY = pageY
  const pickup2 = pickup.bind(elem)
  pickup2(event)

  expect(elem.style.width).toBe(`${width}px`)
  expect(elem.style.height).toBe(`${height}px`)
  expect(elem.style.position).toBe("absolute")
  expect(elem.style.left).toBe(`${pageX}px`)
  expect(elem.style.top).toBe(`${pageY}px`)
  expect(elem.style.zIndex).toBe("100")
  expect(chessboard_elem.addEventListener.mock.calls.length).toBe(1)
  expect(chessboard_elem.addEventListener.mock.calls[0][0]).toBe("mousemove")
  expect(elem.addEventListener.mock.calls.length).toBe(1)
  expect(elem.addEventListener.mock.calls[0][0]).toBe("mouseup")
})
