import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useWindowWidth } from "@/helpers/useWindowWidth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "./button";
import { Textarea } from "./textarea";

type TodosType = {_id: number, title: string, content: string, completed: boolean}[]
type TodoType = {_id: number, title: string, content: string, completed: boolean}

export const TasksGrid = ({
  items,
  setItems,
  completeTodo,
  deleteTodo,
  editTodoContent,
  className,
}: {
  items: TodosType | undefined;
  setItems: Dispatch<SetStateAction<TodosType | undefined>>;
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
  let windowWidth:number = useWindowWidth();

  // Update complete field in an item before fetch is done
  const updateItemCompletedField = (id: number, method: string) => {
    // Update completed field's UI before fetch is done
    setItems(prevItems => 
      prevItems!.map(item => 
        item._id === id ? {...item, completed: (method === "complete" ? true : false)} : item
      )
    )
    // Update the actual field in the database
    completeTodo(id, method)
  }

  return (
    <>
    {(items != undefined && items.length === 0) && <div className="w-full flex justify-center items-center mt-8"><span className="text-gray-500">No added tasks yet.</span></div>}
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10 px-2",
        className
      )}
    > 
      {(items != undefined) && items.map((item, idx) => (
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
            <CardContent>{item.content}</CardContent>
            <TopBottuns>
              <span className={(item.completed ? 'text-white': 'text-red-700') + " font-poppins"}>{item.completed ? 'Completed': 'Incompleted'}</span>
              {item.completed && <i onClick={() => {updateItemCompletedField(item._id, "incomplete")}} className="fa-regular fa-square-check text-green-500 text-[17px] cursor-pointer"></i>||
              <i onClick={() => {updateItemCompletedField(item._id, "complete")}} className="fa-regular fa-square text-gray-400 hover:text-green-400 hover:scale-110 cursor-pointer"></i>}
            </TopBottuns>
            <BottomButtons>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditTodo({...editTodo, id: item._id})} variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Content</DialogTitle>
                      <DialogDescription>
                        Make changes to your task from here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-3">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="content" className="text-left">
                          New content
                        </Label>
                        <Textarea id="content" onChange={(e) => setEditTodo({...editTodo, newContent: e.target.value})}>{item.content}</Textarea>  
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button onClick={() => {editTodoContent(editTodo); setEditTodo({id: -1, newContent: ""})}}>Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <i className="fa-solid fa-trash-can cursor-pointer text-red-600"></i>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        task and remove its data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTodo(item._id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </BottomButtons>
          </Card>
        </div>
      ))}

      {/* Extra items for nice layout filling */}
      {(items != undefined && (items.length < 3 && items.length > 0 && windowWidth >= 768)) && [...Array(((windowWidth >= 1024) ? 3: 2) - items.length)].map((elementInArray, index) => {
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
export const TopBottuns = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("absolute top-2 right-2 flex items-center gap-2", className)}>
      {children}
    </div>
  )
}
export const BottomButtons = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      {children}
    </div>
  )
}