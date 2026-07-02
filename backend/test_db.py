import asyncio
from app.db.session import init_db
from app.crud import problems
from app.models.problem import ProblemModule
from app.schemas.problem import Problem

async def test():
    try:
        await init_db()
        res = await problems.get_multi_by_module(module=ProblemModule.SCHOOL)
        print("DB School Count:", len(res))
        if len(res) > 0:
            p = Problem.from_orm(res[0])
            print("Pydantic parse success:", p.id)
        
        # also test college
        c_res = await problems.get_multi_by_module(module=ProblemModule.COLLEGE)
        print("DB College Count:", len(c_res))
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
