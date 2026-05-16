import type { RequestHandler } from "express";
import { Errors } from "../../utils/errors";
import * as AppointmentsService from "./appointments.service";

export const createAppointment: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await AppointmentsService.bookAppointment(req.auth.userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const myAppointments: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await AppointmentsService.myAppointments(req.auth.userId, req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const cancelAppointment: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await AppointmentsService.cancelAppointment(
      req.auth.userId,
      req.params.id,
      req.body.cancellationReason,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await AppointmentsService.updateAppointmentStatus({
      actor: req.auth,
      appointmentId: req.params.id,
      status: req.body.status,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

