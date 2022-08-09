
export function registerVal(username, password){
  const error = {};

  if(!username || username.trim === '' ||username.length > 20 || username.length < 5){
	error.username = " Username length must be from 5 to 20. ";
  }

  if(!/^[a-zA-Z0-9-_]*$/.test(username)){
	error.username = " Username must contain alphanumeric characters only. "
  }

  if( !password || password.length < 8 ){
	error.password = " Password must be at least 8 characters long. "
  }
 
 return {
 	error,
	valid: Object.keys(error).length <1,
 };
};

export function loginVal(username, password) {
    const error = {};

    if( !username || username.trim === ''){
	error.username = " Username mustn't be empty. "
    }

    if ( !password ) {
    	error.password = " Password mustn't be empty. "
    }

  return {
  	error,
	valid: Object.keys(error).length < 1,
	};
}

export function projectNameError(name){
	if(name.trim() === '' || !name || name.length > 60)
		return "Project name mustn't be more than 60 character.";
}

export function projectMemberError(members){
	if(!Array.isArray(members))
		return "Members should be an array"
}

export function createProjectValidator(name, members){
	const error = {};
	const nameError = projectNameError(name)
	const memberError = projectMemberError(members)
	if(nameError)
		error.name = nameError
	if(memberError)
		error.member = memberError
	return {
		error,
		valid: Object.keys(error).length < 1
	}
	
}

export function createBugValidator(title, description, priority){
	const errors = {}
	const validPriorities = ['low', 'medium', 'high']
	if (!title || title.trim() === '' || title.length > 60 || title.length < 3) {
    errors.title = 'Title must be in range of 3-60 characters length.';
  }

  if (!description || description.trim() === '') {
    errors.description = 'Description field must not be empty.';
  }

  if (!priority || !validPriorities.includes(priority)) {
    errors.priority = 'Priority can only be - low, medium or high.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
export default registerVal;
