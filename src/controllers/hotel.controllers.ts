import { Request, Response } from "express";
import { createHotel, FindHotelAll, FindHotelById, updateHotel } from "../dataBaseManager/hotel";
import { IHotelControllers } from "../interfaces/hotel/hotelControllers.interface";

export class HotelControllers implements IHotelControllers {
  async findAll(_req: Request, res: Response) {
    const response = await FindHotelAll()
    return res.json({
      response
    })
  }
  async findById(req: Request, res: Response) {
    const { id } = req.params
    const response = await FindHotelById(id)
    return res.json({
      response
    })
  }
  async create(req: Request, res: Response) {
    const reqBody = req.body
    const response = await createHotel(reqBody)
    return res.json({ response })
  }
  async update(req: Request, res: Response) {
    const { id } = req.params
    const body = req.body
    const response = await updateHotel(id, body)
    return res.json({ response })
  }
}