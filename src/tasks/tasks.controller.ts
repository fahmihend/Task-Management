import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { json } from 'express';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private taskSercive: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,
  @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. filter: ${JSON.stringify(filterDto)}`);
    return this.taskSercive.getTask(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param(
    'id', ParseIntPipe) id: number,
    @GetUser() user: User,
    ): Promise<Task> {
    return this.taskSercive.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: createTaskDto,
    @GetUser() user: User,
    ): Promise<Task> {
      this.logger.verbose(`User "${user.username}" creating a new task. data: ${JSON.stringify(createTaskDto)}`);
    return this.taskSercive.createTask(createTaskDto, user);
   }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe,) id: number,
  @GetUser() user: User): Promise<void> {
    return this.taskSercive.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskSercive.updateTaskStatus(id, status, user);
  }

}
