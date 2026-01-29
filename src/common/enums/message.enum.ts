export enum BadRequestMessage {
    InValidLoginData = "اطلاعات ارسال شده برای ورود معتبر نمی باشد",
    InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام معتبر نمی باشد",
    SomeThingWrong = "خطایی پیش آمده مجددا تلاش کنید",
    InValidCategories = "دسته بندی ها را درست وارد کنید",
    AlreadyAccepted = "نظر انتخاب شده قبلا تایید شده است",
    AlreadyRejected = "نظر انتخاب شده قبلا رد شده است"
}

export enum AuthtMessage {
    NotFoundAccount = "حساب کاربری یافت نشد",
    AlreadyExistAccount = "حساب کاربری از قبل وجود دارد",
    ExpiredCode = "کد ارسال شده منقضی شده است",
    TryAgain = "لطفا مجددا تلاش کنید",
    LoginAgain = "مجددا وارد  حساب کاربری شوید",
    LoginIsRequired = "ورود به حساب کاربری الزامی است",
    Blocked = "حساب کاربری شما مسدود می باشد است لطفا با پشتیبانی در ارتباط باشید"
}

export enum NotFoundtMessage {
    NotFound = "موردی یافت نشد",
    NotFoundCategory = "دسته بندی یافت نشد",
    NotFoundPost = "مقاله ای یافت نشد",
    NotFoundUser = "کاربری یافت نشد",

}

export enum ValidationMessage {
    InvalidImageFormat = "فرمت تصویر انتخاب شده باید از نوع معتبر باشد",
    InvalidEmailFormat = "ایمیل وارد شده صحیح نمیباشد",
    InvalidPhoneFormat = "شماره موبایل وارد شده صحیح نمیباشد"
}

export enum PublicMessage {
    SentOtp = "کد ارسال شده به شما",
    LoggedIn = "ورود با موفقیت انجام شد",
    Created = "با موفقیت ایجاد شد",
    Deleted = "با موفقیت حذف شد",
    Updated = "با موفقیت بروزرسانی شد",
    Inserted = "با موفقیت درج شد",
    Like = "مقاله با موفقیت لایک شد",
    DisLike = "لایک شما از مقاله برداشته شد",
    Bookmark = "مقاله با موفقیت ذخیره شد",
    UnBookmark = "مقاله از لیست مقالات ذخیره شده برداشته شد",
    CreatedComment = "نظر شما با موفقیت ثبت شد",
    SendOtp = "کد تایید با موفقیت ارسال شد",
    Followed = "با موفقیت دنبال شد",
    UnFollowe = "از لیست دنبال شوندگان حذف شد",
    Blocked = "حساب کاربری با موفقیت مسدود شد",
    UnBlock = "حساب کاربری از حالت مسدود خارج شد",
}

export enum ConflictMessage {
    CategoryTitle = "عنوان دسته بندی از قبل وجود دارد",
    LoggedIn = "",
    Created = "",
    Email = "ایمیل توسط شخص دیگری استفاده شده",
    Phone = "شماره موبایل توسط شخص دیگری استفاده شده",
    Username = "نام کاربری توسط شخص دیگری استفاده شده",
}