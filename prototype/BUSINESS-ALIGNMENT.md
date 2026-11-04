# Zucco — бизнес қоидаларига мослаштириш

2026-11-02. Ушбу ҳужжат маҳаллий дизайн прототипининг backend шартномалари билан боғланишини тушунтиради. Асосий мақсад — ишлаб чиқувчи экрандаги амални тегишли шартнома ва бизнес қоидаси билан солиштира олиши.

22 та саҳифа ва 16 та қўшимча ҳолат тайёрланган. Кўринадиган интерфейс ўзбек кириллицасида; брендлар, курс кодлари ва техник идентификаторлар ўз ёзувида қолдирилган. Яшил `#146B52`, оқ `#FFFFFF` ва аввалги оч фон сақланган.

## Манбалар ва экранлар

Манба йўллари репозиторий илдизига нисбатан берилган. Макетни мослаштириш учун backend коди ўзгартирилмади.

| Жараён | Макетдаги хулқ | Текширилган манба |
| --- | --- | --- |
| Лидни талабага айлантириш | Янги профиль ёки телефонга мос мавжуд талаба; ихтиёрий гуруҳ ва қўшилиш санаси; такрорлаш янги талаба яратмайди | `backend/src/Zucco.Application/Leads/Contracts/LeadContracts.cs`, `Leads/Services/LeadService.cs` |
| Лид босқичлари | Янги, боғланилди, синов белгиланди, синовда қатнашди, кутиш рўйхати, талабага айланди, йўқотилди; йўқотишда сабаб танланади | `backend/src/Zucco.Domain/Leads/Enums/LeadEnums.cs` ва `LeadService.cs` |
| Талаба ва гуруҳ | Ҳар бир ёзилиш алоҳида: `StudentId`, `GroupId`, `JoinedDate`, `Status`, `CustomPrice`; иккинчи гуруҳ аввалгисини алмаштирмайди | `backend/src/Zucco.Application/Students/Contracts/StudentContracts.cs`, `Groups/Contracts/GroupContracts.cs` |
| Сиғим ва қайта ёзилиш | Фаол ва синов мақомидаги ёзилишлар сиғимга киради; чиққан/музлатилган ёзилиш қайта фаоллаштирилиши мумкин | `backend/src/Zucco.Application/Groups/Services/GroupService.cs` |
| Ёзилиш ҳолати | Ҳолат ва чиқиш санаси алоҳида таҳрирланади. Фаол ёзилишнинг шахсий нархини ўзгартириш амали қўшилмаган: мавжуд `ChangeStudentGroupStatusRequest` бундай майдон қабул қилмайди | `GroupContracts.cs`, `GroupService.cs` |
| Музлатиш / давом эттириш | Бошланиш, тугаш ва сабаб; давр жорий давомат ва ҳисоблашда текширилади; давом эттиришда балансга қараб фаол/қарздор ҳолати тикланади | `backend/src/Zucco.Domain/Students/Entities/Student.cs`, `Students/Services/StudentService.cs` |
| Гуруҳ яратиш | Курс, ўқитувчи, филиалга тегишли хона, бошланиш/тугаш, кунлар, вақт, нарх, сиғим ва ҳисоблаш модели | `GroupContracts.cs`, `GroupService.cs`, `backend/src/Zucco.Domain/Groups/Scheduling/ScheduleDays.cs` |
| Дарслар жадвали | Гуруҳ кунлари бўйича 1–366 дарс; мавжуд дарслар ҳам сўралган сонга киради; қайта ишга тушириш такрорламайди; тугаш санасига сиғмаган сўров қисман сақланмайди | `GroupService.GenerateLessonsScheduleAsync`, `Zucco.Common/Constants/Constants.cs` |
| Тўлов | Талаба, пул ҳисоби, сумма, 6 усул; ихтиёрий гуруҳ, `yyyy-MM` даври ва изоҳ; 2 каср хонаси; барқарор амал идентификатори | `backend/src/Zucco.Application/Finance/Contracts/FinanceContracts.cs`, `Finance/Services/FinanceService.cs` |
| Харажат | Пул ҳисоби, харажат тури, сумма, изоҳ; ихтиёрий филиал ва қабул қилувчи; амал идентификатори | Ўша `FinanceContracts.cs` ва `FinanceService.cs` |
| Ўқув тўловини ҳисоблаш | Календарь ойи — тўлиқ ой; даврли — жорий 30 кун; тўлиқ курс — нарх × ойлар; дарсбай — ўтилган ва давомат ёзуви бор, узрли қолдирилмаган дарслар | `backend/src/Zucco.Application/Finance/Services/TuitionBillingService.cs` |
| Ҳисоблаш чекловлари | Фаол гуруҳ + фаол ёзилиш; курс/ёзилиш санаси; талаба ҳолати ва музлатиш; синов ҳисобланмайди; enrollment + mode + period калити такрорланмайди | `TuitionBillingService.cs` |
| Маош схемалари | Тушумдан фоиз, ҳар бир талаба, ҳар бир дарс, белгиланган ойлик; гуруҳга хос схема умумий схемадан устун; умумий белгиланган ойлик бир марта | `backend/src/Zucco.Application/Payroll/Contracts/PayrollContracts.cs`, `Payroll/Services/PayrollService.cs` |
| Маош фильтрлари | Фақат тўлаганлар: айнан гуруҳ ва ҳисоб даврига боғланган тўлов; давомат шарти; бонус ва ушланма | `PayrollService.CalculateSalaryAsync` |
| Маош тўлаш | `Pending → Approved → Paid`; пул ҳисоби ва харажат тури; фақат тўлиқ тасдиқланган сумма, бир марта | `PayrollService.PaySalaryAsync` |
| Давомат | Гуруҳ/санага боғланган ёзувлар; `Present`, `Excused`, `Unexcused`, `Late`; келажак ва бекор қилинган дарс чекланади; музлатилган/мос ёзилиши йўқ талаба юборилмайди | `backend/src/Zucco.Application/Attendance/Contracts/AttendanceContracts.cs`, `Attendance/Services/AttendanceService.cs` |
| Давомат ва тангалар | `Present` га ўтишда автоматик +5; ундан чиқишда −5; қайта сақлаш такрорий танга бермайди. +1/+5 тугмалари алоҳида қўшимча рағбат | `AttendanceService.MarkLessonAttendanceAsync`, `Constants.Billing.AttendanceCoins` |
| Баҳо ва ўқитувчи | Баҳо учун `attendance.grade`; 0–100 бутун сон. Оддий Teacher фақат ўз дарсини белгилайди. Баҳо рухсатисиз мавжуд баҳоларни ўчириб юбориши мумкин бўлган сақлаш чекланган | `AttendanceService.cs` |
| Танга тузатиш / харид | Нолдан фарқли бутун ўзгариш; манфий якуний балансга йўл қўйилмайди; харидда қолдиқ ва тангалар текширилади; амал идентификатори | `backend/src/Zucco.Application/Gamification/Services/GamificationService.cs` |
| SMS | Ҳар бир телефон учун алоҳида хабар; провайдер қабул қилса `Pending`; `Failed` ва `Unknown` алоҳида; қабул қилинганлик етказилганлик сифатида кўрсатилмайди | `backend/src/Zucco.Application/Notifications/Contracts/NotificationContracts.cs`, `Notifications/Services/NotificationService.cs` |
| Янги ходим | Пароль камида 12 белги, ишга кирган сана, лавозим тури, филиал; лавозим ва рухсатлар роли алоҳида | `backend/src/Zucco.Application/Identity/Contracts/StaffContracts.cs`, `Zucco.Domain/Identity/Enums/StaffRoleType.cs` |
| Курс / хона | Курсда `Active / Inactive / Archived`, ҳақиқий даражалар; хонанинг 4 тури. Курс учун `Draft` ҳолати қўлланилмайди | `Zucco.Domain/Courses/Enums`, `Zucco.Domain/Branches/Enums/RoomType.cs` |
| Рухсатлар | Умумий CRUD жадвали ўрнига backend'даги ҳар бир permission; Owner/Administrator/Teacher/Cashier бошланғич тўпламлари seeder билан солиштирилган | `backend/src/Zucco.Common/Constants/Permissions.cs`, `Zucco.Infrastructure/Persistence/DbSeeder.cs` |

## UI майдонларини API га боғлаш

Прототипдаги қисқа номлар wire payload эмас. Ишлаб чиқишда қуйидаги боғланиш ва реал lookup ID'лари ишлатилади:

| Прототип | API шартномаси |
| --- | --- |
| `studentId`, `accountId`, `amount`, `method` | `StudentId`, `CashAccountId`, `Amount`, `PaymentMethod` |
| `groupId`, `billingPeriod`, `comment`, `operationId` | `GroupId`, `BillingPeriod`, `Comment`, `OperationId` |
| Харажатда `categoryId`, `description`, `recipient` | `ExpenseCategoryId`, `Description`, `Recipient` |
| Маошда `type`, `rate`, `active` | `CalculationType`, `RateValue`, `IsActive` |
| Давоматда `studentId`, `status`, `score`, `homeworkStatus` | `Students[]` ичида `StudentId`, `Status`, `Score`, `HomeworkStatus` |
| SMS да `phone`, `message`, `trigger` | `RecipientPhone`, `Message`, `Trigger` |

`a1`, `g1`, `s1` каби ID'лар — fixture идентификаторлари. Реал GUID, enum сериализацияси, `ApiResponse` envelope ва хатолар API adapter орқали боғланиши керак. Чек тайёрлаш танлови frontend хулқи; у `RecordPaymentRequest` майдони эмас.

## Прототипнинг аниқ чегараси

Бу live API интеграцияси ёки production frontend эмас. Ҳисоблар, талабалар ва амаллар хотирадаги намуналар; саҳифа янгиланганда дастлабки ҳолатга қайтади. Реал тўлов, SMS, аутентификация ёки принтерга ҳеч нарса юборилмайди. `OperationId` ва рухсат текширувлари дизайнда оқимларни кўрсатади; сервердаги транзакция, tenant изоляцияси, рақобатли сўровлар ва хавфсизликни алмаштирмайди.

Ҳисоблаш санаси намуна учун `2026-11-02` га маҳкамланган. Пул ҳисобларининг бошланғич қолдиғи ва талабаларнинг кириш баланси алоҳида fixture. Талаба баланси умумий баланс; уни тўлиқ филиалга тегишли қарз деб талқин қилиш мумкин эмас. Умумий пул ҳисоблари ҳар икки филиалда кўринади.

Талабалар рўйхатидаги кўп гуруҳли ва филиал бўйича кўринишлар enrollment маълумотларидан йиғилади. Мавжуд `GetStudentsPagedAsync` да `BranchId` фильтри йўқ, `StudentListItem.PrimaryGroup` эса ҳозир `null` қайтарилади. Production adapter учун бу маълумотларни йиғиш стратегияси ва pagination аниқланиши лозим; макетда мавжуд бўлмаган сервер фильтри бор деб фараз қилинмади.

Ҳисоботлар бир хил намунавий реестрдан ҳисобланади; алоҳида янги reports API бор деб кўрсатилмаган. Марказ созламалари кўриш учун, кўриниш созламалари маҳаллий. Талаба формаси битта асосий ота-она/васийни таҳрирлайди; backend'даги `Parents[]` нинг кўп контактли редактори алоҳида UI иши бўлиб қолади. Барча entity'лар учун ўчириш/архивлаш/таҳрирлаш ҳолатларининг тўлиқ каталоги бу пакетнинг қамрови эмас.

Баҳо рухсатисиз давоматни қисман таҳрирлашда мавжуд API `Score=null` ни сақлаши мумкин; макет мавжуд баҳони йўқотиши мумкин бўлган амални тўхтатади. Шу сценарий production'да талаб этилса, API шартномаси бўйича алоҳида қарор керак.

Шу сабабли пакетга «100% production мос» деган баҳо берилмайди. У асосий экранлар ва текширилган бизнес оқимлари учун дизайн/интеграция асосидир.

## Текширув далиллари

`business-verification.json`: 27 та текширув ўтган; 22 саҳифа × 5 кенглик = 110 та жойлашув ҳолати; барча 16 preview очилган; console хатоси йўқ. Permission калитлари репозиторийдаги `Permissions.cs` билан автоматик солиштирилган. Бу локал прототип текшируви; backend integration тестлари ўтган деган даъво эмас.

`exports/export-audit.json`: 38 та 1440 px кенгликдаги SVG. Матнлар `<text>`, шакллар ва иконкалар вектор; UI учун `<image>` ёки `<foreignObject>` йўқ. PNG'лар фақат кўриш ва визуал QA учун.

Асл Figma файлига тўғридан-тўғри ёзиш коннекторнинг Starter лимити сабаб бажарилмади. Ушбу пакет Figma'га импорт қилиш учун тайёрланган маҳаллий натижа. Импорт компонентлар, вариантлар, variable binding ёки Auto Layout'ни автоматик яратмайди.
