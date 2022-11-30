/**
 * @jest-environment jsdom
 */

import Bills from "../containers/Bills"
import userEvent from '@testing-library/user-event'

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
