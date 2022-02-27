import { combineReducers } from "redux";
import ErrorReducer from "./ErrorReducer";
import FormReducer from "./FormReducer";
import OtpReducer from "./OtpReducer";
import UserReducer from "./UserReducer";
import QuesReducer from "./QuesReducer";
import FetchingReducer from "./IsFetching";
const RootReducer = combineReducers({ error: ErrorReducer, form: FormReducer, otpType: OtpReducer, user: UserReducer, questions: QuesReducer, fetch: FetchingReducer });
export default RootReducer;