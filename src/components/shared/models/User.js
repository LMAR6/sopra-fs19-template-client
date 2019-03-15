/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.creationdate=null;
    this.birthday=null;
    Object.assign(this, data);
  }
}
export default User;
