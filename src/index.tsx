import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { Database } from "bun:sqlite";
import { migrate, getMigrations } from "bun-sqlite-migrations";
import { faker } from "@faker-js/faker";

const db = new Database(":memory:");
migrate(db, getMigrations("./migrations"));

type HabitT = {
  id: number;
  title: string;
  description: string;
  color: string;
};

const listAllHabits = (db: Database) => {
  return db.query("select * from habits order by id desc").all() as HabitT[];
};

const deleteHabitById = (db: Database, id: string) => {
  return db.query(`delete from habits where id = ${id}`).run({ $id: id });
};

const addHabit = (db: Database, title: string, description: string) => {
  const color = faker.color.rgb();
  const result = db
    .query(
      `insert into habits (title, description, color) values ` +
        `($title, $description, $color) ` +
        `returning *`
    )
    .get({ $title: title, $description: description, $color: color });
  return result as HabitT;
};

const TitleInput = ({ title }: { title: string }) => {
  return (
    <div class={"flex flex-col text-gray-400 w-full flex"}>
      <label for="title">Title</label>
      <input
        type="text"
        name="title"
        id="title"
        value={title}
        class={"bg-gray-800 rounded-md"}
      />
    </div>
  );
};

const DescriptionInput = ({ description }: { description: string }) => {
  return (
    <div class={"flex flex-col text-gray-400 w-full flex"}>
      <label for="description">Description</label>
      <textarea
        name="description"
        id="description"
        class={"bg-gray-800 rounded-md"}
      >
        {description}
      </textarea>
    </div>
  );
};

const AddHabitForm = () => {
  return (
    <form
      class={"w-full rounded-md border-slate-700 border p-4 mb-4"}
      id="form"
      hx-post="/habit"
      hx-target={"this"}
      hx-swap={"outerHTML"}
    >
      <TitleInput title={faker.lorem.slug()} />
      <DescriptionInput description={faker.lorem.lines(1)} />
      <div class={"flex gap-1 mt-3"}>
        <button class={"px-3 py-1 bg-gray-500 rounded-md"} type="submit">
          Save
        </button>
        <button
          class={"px-3 py-1 bg-sky-500 rounded-md"}
          hx-get={"/habit/add/cancel"}
          hx-target={"#form"}
          hx-swap={"outerHTML"}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const AddHabit = () => {
  return (
    <button
      class={
        "w-full rounded-md bg-gray-800 hover:bg-gray-700 p-3 " +
        "font-bold mb-4"
      }
      hx-get={"/habit/add"}
      hx-target={"this"}
      hx-swap={"outerHTML"}
    >
      Add Habit
    </button>
  );
};

const HabitComponent = ({ habit }: { habit: HabitT }) => {
  return (
    <div
      class="border border-gray-700 rounded-md mb-4 p-4"
      id={`habit-${habit.id}`}
    >
      <h1 class={"font-bold"}>{habit.title}</h1>
      <p class={"text-sm text-gray-500"}>{habit.description}</p>
      <div class={"flex gap-1 text-sm mt-3"}>
        <button class={"hover:text-sky-700"}>Edit</button>
        <span>•</span>
        <button
          class={"hover:text-red-700"}
          hx-confirm={"Are you sure?"}
          hx-delete={`/habit/${habit.id}`}
          hx-target={`#habit-${habit.id}`}
          hx-swap={"outerHTML"}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const RootPage = () => {
  const habits = listAllHabits(db);
  return (
    <section class="bg-gray-900 text-white">
      <div class="mx-auto max-w-screen-lg px-4 py-10">
        <h1
          class={
            "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text " +
            "text-3xl font-extrabold text-transparent sm:text-5xl mb-10"
          }
        >
          Simple Habit Tracker
        </h1>
        <AddHabit />
        {habits.map((habit) => (
          <HabitComponent habit={habit} />
        ))}
      </div>
    </section>
  );
};

const rootHandler = () => {
  return (
    <html lang="en">
      <head>
        <title>Hello World</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      </head>
      <body>
        <RootPage />
      </body>
    </html>
  );
};
const app = new Elysia()
  .use(html())
  .get("/", rootHandler)
  .delete("/habit/:id", ({ params: { id } }) => {
    console.log("deleting habit by id:", id);
    deleteHabitById(db, id);
    return null;
  })
  .get("/habit/add", AddHabitForm)
  .get("/habit/add/cancel", AddHabit)
  .post("/habit", ({ body }) => {
    const result = addHabit(db, body.title, body.description);
    console.log({ result });
    return (
      <>
        <AddHabit />
        <HabitComponent habit={result} />
      </>
    );
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
