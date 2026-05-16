import type { RequestHandler } from "express";
import * as DoctorsService from "./doctors.service";
import { Errors } from "../../utils/errors";
import { updateMyDoctorProfile } from "./doctors.profile";

export const listDoctors: RequestHandler = async (req, res, next) => {
  try {
    const result = await DoctorsService.listDoctors(req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getDoctor: RequestHandler = async (req, res, next) => {
  try {
    const result = await DoctorsService.getDoctor(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getDoctorAvailability: RequestHandler = async (req, res, next) => {
  try {
    const result = await DoctorsService.getDoctorAvailability(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createAvailability: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await DoctorsService.createAvailability(req.auth.userId, req.body.slots);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDoctorAppointments: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await DoctorsService.getDoctorAppointments(req.auth.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.auth) throw Errors.unauthorized();
    const result = await updateMyDoctorProfile(req.auth.userId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
