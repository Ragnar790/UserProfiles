import React from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

function Pages({ sliceUsers }) {
	//useStateWithCallbackLazy makes sure that rendering is done only after setState is completed
	const [start, setStart] = useStateWithCallbackLazy(1);

	//FUNCTION TO HANDLE NAVIGATION BUTTON CLICKS
	const navClick = (x) => {
		if (x === "prev") {
			//setState will take a callBack function
			setStart(start - 1, (c) => {
				sliceUsers(c);
			});
		} else if (x === "next") {
			setStart(start + 1, (c) => {
				sliceUsers(c);
			});
		} else {
			setStart(x, (c) => {
				sliceUsers(c);
			});
		}
	};
	return (
		<div className="App">
			<Pagination size="lg">
				<PaginationItem disabled={start === 1}>
					<PaginationLink previous href="#" onClick={() => navClick("prev")} />
				</PaginationItem>
				<PaginationItem active>
					<PaginationLink href="#" onClick={() => navClick(start)}>
						{start}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" onClick={() => navClick(start + 1)}>
						{start + 1}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" onClick={() => navClick(start + 2)}>
						{start + 2}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" onClick={() => navClick(start + 3)}>
						{start + 3}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" onClick={() => navClick(start + 4)}>
						{start + 4}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink next href="#" onClick={() => navClick("next")} />
				</PaginationItem>
			</Pagination>
		</div>
	);
}

export default Pages;
