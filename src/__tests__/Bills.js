/**
 * @jest-environment jsdom
 */

import Bills from "../containers/Bills"
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI"
import { fn } from "jquery"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList).toContain("active-icon")

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("then an icon eye are clicked a modal appears", async() => {
      document.body.innerHTML = BillsUI({ data: bills })
      new Bills({ document, onNavigate: () => {}, store: null, localStorage: null })
      const iconEye = screen.getAllByTestId('icon-eye')
      const iconEye1 = iconEye[0]
      const mockModal = jest.fn()
      $.fn.modal = mockModal
      userEvent.click(iconEye1)
      expect(mockModal).toHaveBeenCalledWith('show')
    })
    test("then 'new bill' button are clicked new bill's form appears ", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const billsTest  = new Bills({ document, onNavigate: ()=> {}, store: null, localStorage: null })
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      const mockHandleClick = jest.fn(() => billsTest.handleClickNewBill())
      const mockOnNavigate = jest.fn(() => billsTest.onNavigate)
      billsTest.onNavigate = mockOnNavigate
      buttonNewBill.addEventListener('click', mockHandleClick)
      userEvent.click(buttonNewBill)
      expect(mockHandleClick).toBeCalled()
      expect(mockOnNavigate).toBeCalledWith(ROUTES_PATH["NewBill"])
    })
  })
})
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Billed", () => {
    test("fetches bills from mock API GET", async () => {
      // localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)
      // router()
      // window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => {
        const tilte = screen.getByText("Mes notes de frais")
        expect(tilte).toBeTruthy()
      })
      const contentBilled  = screen.getByTestId("tbody")
      expect(contentBilled).toBeTruthy()
      const sortBills = bills.sort((a, b) => (a.date <= b.date) ? 1 : -1)
      if (sortBills.length !== 0) {
        const firstLine = contentBilled.firstChild
        const typeFirstLine = screen.getByText(`${sortBills[0].type}`)
        console.log(typeFirstLine.innerHTML)
        console.log(typeFirstLine.nextElementSibling.innerHTML)
        expect(typeFirstLine.innerHTML).toBe(sortBills[0].type)
        const nameFirstLine = typeFirstLine.nextElementSibling.innerHTML
        expect(nameFirstLine).toBe(sortBills[0].name)
      }
      
    })
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Dashboard)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })

  })
})
