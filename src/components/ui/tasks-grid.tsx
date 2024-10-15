import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useWindowWidth } from "@/helpers/useWindowWidth";

export const TasksGrid = ({
  items,
  completeTodo,
  deleteTodo,
  editTodoContent,
  className,
}: {
  items: {
    _id: number;
    title: string;
    content: string;
    completed: boolean;
  }[];
  completeTodo: (todo_id: number, method: string) => Promise<void>;
  deleteTodo: (todo_id: number) => Promise<void>;
  editTodoContent: (editTodo: { id: number, newContent: string }) => Promise<void>;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState({
    id: -1,
    newContent: ""
  });
  let windowWidth:number = useWindowWidth()

  return (
    <>
    {(items.length === 0) && <div className="w-full flex justify-center items-center mt-8"><span className="text-gray-500">No added tasks yet.</span></div>}
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10 px-2",
        className
      )}
    > 
      {items.map((item, idx) => (
        <div
          key={item?._id}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardContent>{(editTodo.id === item._id) && <textarea onChange={(e) => setEditTodo({...editTodo, newContent: e.target.value})} className="w-full p-2 rounded-sm min-h-[100px]">{item.content}</textarea> || item.content}</CardContent>
            <div className="flex justify-between items-center">
            {(editTodo.id === item._id) && <button onClick={() => {editTodoContent(editTodo); setEditTodo({id: -1, newContent: ""})}} className="px-4 py-2 rounded-md border border-emerald-300 bg-emerald-100 text-emerald-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">Done</button>
            || <button onClick={() => setEditTodo({...editTodo, id: item._id})} className="px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">Edit</button>}
              <i onClick={() => deleteTodo(item._id)} className="fa-solid fa-trash-can cursor-pointer text-red-600"></i>
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <span className={(item.completed ? 'text-white': 'text-red-700') + " font-poppins"}>{item.completed ? 'Completed': 'Incompleted'}</span>
              {item.completed && <i onClick={() => completeTodo(item._id, "incomplete")} className="fa-regular fa-square-check text-green-500 text-[17px] cursor-pointer"></i>||
              <i onClick={() => completeTodo(item._id, "complete")} className="fa-regular fa-square text-gray-400 hover:text-green-400 hover:scale-110 cursor-pointer"></i>}
            </div>
          </Card>
        </div>
      ))}

      {/* Extra items for nice layout filling */}
      {(items.length < 3 && items.length > 0 && windowWidth >= 768) && [...Array(((windowWidth >= 1024) ? 3: 2) - items.length)].map((elementInArray, index) => {
        return <Link key={index} href="/dashboard/addTodo" className="relative group  block p-2 h-full w-full">
            <div className={cn(
              "flex justify-center items-center rounded-2xl h-full w-full p-4 overflow-hidden bg-gray-100 border border-gray-400 border-dashed dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
              className
            )}><i className="fa-solid fa-square-plus text-[20px]"></i></div>
          </Link>
      })}
    </div>
    </>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-10",
        className
      )}
    >
      <div className="relative z-10">
        <div className="p-4 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};