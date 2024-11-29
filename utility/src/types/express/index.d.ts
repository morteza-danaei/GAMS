import express from "express";

interface Session extends Object {
  jwt?: string;
}

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}
