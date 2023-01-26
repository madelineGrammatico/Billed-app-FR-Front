/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
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
      jest.spyOn(mockStore, "bills")
      const createMock = jest.fn(() => Promise.resolve({fileUrl: "fileUrl", key: "key"}))
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create :createMock
        }})
      
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({document, onNavigate: () => {}, store: mockStore, localStorage: null})
      const file = screen.getByTestId("file")
   
      const formData = new FormData()
      const blob =  new File([], "test.jpg")
      formData.set("file", blob)
      formData.set("email", "a@a")
      userEvent.upload(file, blob)
      expect(createMock).toHaveBeenCalledWith({ 
        data: formData,
        headers: {
          noContentType: true
        }
      })
    })
  })

  describe("When an error appear", ()=> {
    test('then it should be console.log the error', () => {
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({document, onNavigate: () => {}, store: mockStore, localStorage: null})
      const file = screen.getByTestId("file")
      const formData = new FormData()
      const blob =  new File([], "test.pdf")
      formData.set("file", blob)
      formData.set("email", "a@a")
      userEvent.upload(file, blob)
      expect(file.validationMessage).toBe("Accepted extentions are .jpeg .jpg .png")
      
    })
  })
})
