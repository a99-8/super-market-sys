import ar from "./messages/ar.json";

type Messages = typeof ar;

declare global {
  interface IntlMessages extends Messages {}
}
