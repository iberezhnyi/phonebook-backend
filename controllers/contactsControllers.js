import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { page = 1, limit = 20, favorite = null } = req.query;
    const skip = (page - 1) * limit;

    const filterOptions = favorite ? { owner, favorite } : { owner };

    const result = await Contact.find(filterOptions, "", {
      skip,
      limit,
    }).populate("owner", "email subscription");

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const result = await Contact.findById(req.params.id);

    if (!result) {
      throw HttpError(404);
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Contact.findByIdAndDelete(id);

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
