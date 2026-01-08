

export enum BadRequestMessage {
    InValidLoginData = "اطلاعات ارسال شده برای ورود معتبر نمی باشد",
    InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام معتبر نمی باشد",
}

export enum AuthtMessage {
    NotFoundAccount = "حساب کاربری یافت نشد",
    AlreadyExistAccount = "حساب کاربری از قبل وجود دارد",
    ExpiredCode = "کد ارسال شده منقضی شده است",
    TryAgain = "لطفا مجددا تلاش کنید",
    LoginAgain = "مجددا وارد  حساب کاربری شوید",
    LoginIsRequired = "ورود به حساب کاربری الزامی است",
}

export enum NotFoundtMessage {

}

export enum ValidationMessage {
}

export enum PublicMessage {
    SentOtp = "کد ارسال شده به شما",
    LoggedIn = "ورود با موفقیت انجام شد",
}