/**
 * @jest-environment jsdom
 */

import { screen , waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"

jest.mock("../app/Store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, form new bills should be rendered", () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({document, onNavigate: () => {}, store: null, localStorage: null})

      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
     
      const submitNewBill = screen.getByText("Envoyer")
      const mockHandleSubmit = jest.fn(() => newBill.handleSubmit)
      submitNewBill.addEventListener("click", mockHandleSubmit)
      userEvent.click(submitNewBill)
      expect(mockHandleSubmit).toBeCalled()
    })
  })
  describe("When I am on NewBill and chose a '.jpg' file on the input", ()=> {
    test('then it should be authorize me to submit the form', () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({document, onNavigate: () => {}, store: null, localStorage: null})
      console.log("store",newBill.store)
      const file = screen.getByTestId("file")
      const mockHandleChangeFile = jest.fn(() => newBill.handleChangeFile)
      file.addEventListener("keydown", mockHandleChangeFile)
      userEvent.type(file, "test.jpg")
      expect(mockHandleChangeFile).toBeCalled()
      expect("store", newBill.store).toBe()
    })
  })
  describe("When I am on NewBill and chose a '.jpeg' file on the input", ()=> {
    test('then it should be authorize me to submit the form', () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({document, onNavigate: () => {}, store: null, localStorage: null})
      console.log(newBill.store)
      const file = screen.getByTestId("file")
      const mockHandleChangeFile = jest.fn(() => newBill.handleChangeFile)
      file.addEventListener("keydown", mockHandleChangeFile())
      userEvent.type(file, "test.jpeg")
      expect(mockHandleChangeFile).toBeCalled()
    })
  })
  describe("When I am on NewBill and chose a '.png' file on the input", ()=> {
    test('then it should be authorize me to submit the form', () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({document, onNavigate: () => {}, store: null, localStorage: null})

      const file = screen.getByTestId("file")
      const mockHandleChangeFile = jest.fn(() => newBill.handleChangeFile)
      file.addEventListener("keydown", mockHandleChangeFile)
      userEvent.type(file, "test.png")
      expect(mockHandleChangeFile).toBeCalled()
    })
  })
})
