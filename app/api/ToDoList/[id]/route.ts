// app/api/ToDoList/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// PUT request handler (Update ToDo)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const { todo } = await req.json();
    if (!todo) {
      return NextResponse.json({ error: 'No todo provided' }, { status: 400 });
    }

    const existingToDo = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!existingToDo || existingToDo.userId !== user.id) {
      return NextResponse.json({ error: 'ToDo not found or unauthorized' }, { status: 404 });
    }

    const updatedToDo = await prisma.toDo.update({
      where: { id },
      data: { todo },
    });

    return NextResponse.json(updatedToDo, { status: 200 });
  } catch (error) {
    console.error('Error updating ToDo:', error);
    return NextResponse.json({ error: 'Error updating ToDo' }, { status: 500 });
  }
}

// DELETE request handler (Delete ToDo)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const existingToDo = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!existingToDo || existingToDo.userId !== user.id) {
      return NextResponse.json({ error: 'ToDo not found or unauthorized' }, { status: 404 });
    }

    await prisma.toDo.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'ToDo deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting ToDo:', error);
    return NextResponse.json({ error: 'Error deleting ToDo' }, { status: 500 });
  }
}
