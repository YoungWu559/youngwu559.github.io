PROGRAM logit

IMPLICIT NONE

INTEGER, PARAMETER :: n_alt = 5, n_obs = 2000, n_par = 3
INTEGER :: i, j
REAL(8), DIMENSION(n_alt * n_par) :: meanz, sdz
REAL(8), DIMENSION(n_alt) :: meanr, sdr
REAL(8), DIMENSION(n_par) :: bmat, b_est
REAL(8), DIMENSION(n_par, n_par) :: var_est
REAL(8), DIMENSION(n_obs, n_alt * n_par) :: z_obs
REAL(8), DIMENSION(n_obs, n_alt) :: r_obs
REAL(8), DIMENSION(n_obs) :: y_obs
REAL(8), DIMENSION(n_obs, n_alt) :: y_obs_m, eps, unif
CHARACTER, DIMENSION(n_par) :: names_b

CALL RANDOM_SEED

meanz = 1.0
sdz = 2.0 * rndu(n_alt * n_par)
meanr = 0.0
sdr = rndu(n_alt)
bmat = (/1.0, 2.0, 3.0/)
DO i = 1, n_obs
    unif(i, :) = rndu(n_alt)
END DO

z_obs = rndn(n_obs, n_alt * n_par, meanz, sdz)
r_obs = rndn(n_obs, n_alt, meanr, sdr)
eps = -LOG(-LOG(unif))
DO j = 1, n_alt
    y_obs_m(:, j) = MATMUL(z_obs(:, (n_par * (j - 1) + 1):(n_par * j)), bmat) + (r_obs(:, j) + eps(:, j))
END DO
y_obs = maxindc(TRANSPOSE(y_obs_m))
names_b = (/'1', '2', '3'/)

CALL clogit(y_obs, z_obs, r_obs, names_b, b_est, var_est)

WRITE(*, *) 'b_est'
CALL prtv(b_est)
WRITE(*, *) 'var_est'
CALL prtm(var_est)

CONTAINS

! ---------- ---------- ---------- ---------- ----------
! Subroutine for logit estimation
! Algorithm by Victor Aguirregabiria
!
! ydum - [nobs] vector of reals, input
! x - [nobs x (k * nalt)] matrix of reals, input
! restx - [nobs x nalt] matrix of reals, input
! namesb - [k] vector of characters, input
! best - [k] vector of reals, output
! varest - [k x k] matrix of reals, output
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE clogit (ydum, x, restx, namesb, best, varest)

CHARACTER, DIMENSION(:), INTENT(IN) :: namesb
REAL(8), DIMENSION(:), INTENT(IN) :: ydum
REAL(8), DIMENSION(:, :), INTENT(IN) :: x, restx
REAL(8), DIMENSION(SIZE(namesb)), INTENT(OUT) :: best
REAL(8), DIMENSION(SIZE(namesb), SIZE(namesb)), INTENT(OUT) :: varest

INTEGER :: nobs, nalt, npar, j, iter
REAL(8) :: cconvb, myzero, criter, llike
REAL(8), DIMENSION(SIZE(namesb)) :: b0, b1, xysum, d1llike
REAL(8), DIMENSION(SIZE(namesb), SIZE(namesb)) :: xxm, d2llike
REAL(8), DIMENSION(SIZE(ydum), SIZE(namesb)) :: xbuff, sumpx
REAL(8), DIMENSION(SIZE(ydum), INT(MAXVAL(ydum))) :: phat

cconvb = 1.d-6
myzero = 1.d-16
nobs = SIZE(ydum)
nalt = INT(MAXVAL(ydum))
npar = SIZE(x, 2) / nalt
IF (npar /= SIZE(namesb)) THEN
    WRITE (*, *) 'ERROR'
    RETURN
END IF

xysum = 0.0
DO j = 1, nalt
    xysum = xysum + sumc(dotmul(x(:, (npar * (j - 1) + 1) : (npar * j)), indicator(ydum == j)))
END DO

iter = 1
criter = 1000
llike = -nobs
b0 = 1.0

DO WHILE (criter > cconvb)
    phat = 0.0
    DO j = 1, nalt
        phat(:, j) = MATMUL(x(:, (npar * (j - 1) + 1) : (npar * j)), b0) + restx(:, j)
    END DO
    phat = dotsub(phat, maxc(TRANSPOSE(phat)))
    phat = dotdiv(EXP(phat), sumc(EXP(TRANSPOSE(phat))))

    sumpx = 0.0
    xxm = 0.0
    llike = 0.0
    DO j = 1, nalt
        xbuff = x(:, (npar * (j - 1) + 1) : (npar * j))
        sumpx = sumpx + dotmul(xbuff, phat(:, j))
        xxm = xxm + MATMUL(TRANSPOSE(dotmul(xbuff, phat(:, j))), xbuff)
        llike = llike + SUM(indicator(ydum == j) * LOG(MAX(phat(:, j), myzero)))
    END DO

    d1llike = xysum - sumc(sumpx)
    d2llike = - (xxm - MATMUL(TRANSPOSE(sumpx), sumpx))
    b1 = b0 - MATMUL(inv(d2llike), d1llike)
    criter = SQRT(DOT_PRODUCT((b1 - b0), (b1 - b0)))
    b0 = b1
    iter = iter + 1
END DO

best = b0
varest = inv(-d2llike)

END SUBROUTINE clogit

! ---------- ---------- ---------- ---------- ----------
! Function for generating a vector of 1s with length n
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION ones (n)

INTEGER :: n
REAL(8), DIMENSION(n) :: ones

ones = 1.0

END FUNCTION ones

! ---------- ---------- ---------- ---------- ----------
! Function for generating an m x n matrix of 0s
! n, m - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION zeros (n, m)

INTEGER :: n, m
REAL(8), DIMENSION(n, m) :: zeros

zeros = 0.0

END FUNCTION zeros

! ---------- ---------- ---------- ---------- ----------
! Function for generating an inducator vector
! True ==> 1, False ==> 0
! x - logical vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION indicator (x)

INTEGER :: n, i
LOGICAL, DIMENSION(:) :: x
REAL(8), DIMENSION(SIZE(x)) :: indicator

n = SIZE(x)
DO i = 1, n
    IF (x(i)) THEN
        indicator(i) = 1.0;
    ELSE
        indicator(i) = 0.0;
    END IF
END DO

END FUNCTION indicator

! ---------- ---------- ---------- ---------- ----------
! Function for element-wise addition of a matrix x and a vector v
! add v to each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotadd (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotadd

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotadd(:, i) = x(:, i) + v
END DO

END FUNCTION dotadd

! ---------- ---------- ---------- ---------- ----------
! Function for element-wise subtraction of a matrix x and a vector v
! subtract v from each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotsub (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotsub

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotsub(:, i) = x(:, i) + v
END DO

END FUNCTION dotsub

! ---------- ---------- ---------- ---------- ----------
! Function for element-wise multiplication of a matrix x and a vector v
! multiply v by each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotmul (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotmul

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotmul(:, i) = x(:, i) * v
END DO

END FUNCTION dotmul

FUNCTION dotmulones (v, n)

INTEGER :: n, m, i
REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(n * SIZE(v)) :: dotmulones

m = SIZE(v)
DO i = 1, m
    dotmulones(((i - 1) * n + 1):(i * n)) = v(i)
END DO

END FUNCTION dotmulones

! ---------- ---------- ---------- ---------- ----------
! Function for element-wise division of a matrix x and a vector v
! divide v from each column of x
! x - real matrix
! v - real vector
! ---------- ---------- ---------- ---------- ----------

FUNCTION dotdiv (x, v)

REAL(8), DIMENSION(:) :: v
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: dotdiv

INTEGER :: m, i

m = SIZE(x, 2)

DO i = 1, m
    dotdiv(:, i) = x(:, i) / v
END DO

END FUNCTION dotdiv

! ---------- ---------- ---------- ---------- ----------
! Function for generating n uniformly distributed variables
! rndu ~ unif(0, 1)
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION rndu (n)

INTEGER :: n, i
REAL(8), DIMENSION(n) :: rndu

DO i = 1, n
    CALL RANDOM_NUMBER(rndu(i))
END DO

END FUNCTION rndu

! ---------- ---------- ---------- ---------- ----------
! Function for generating 1 normally distributed variable
! normal ~ normal(0, 1)
! ---------- ---------- ---------- ---------- ----------

FUNCTION normal ()

REAL(8) :: normal

REAL(8) :: u, v

CALL RANDOM_NUMBER(u)
CALL RANDOM_NUMBER(v)

normal = SQRT(-2.0 * LOG(u)) * COS(2 * 3.141592653589 * v)

END FUNCTION normal

! ---------- ---------- ---------- ---------- ----------
! Function for generating n x m normally distributed variables
! rndn(:, m) ~ normal(mean(m), sd(m))
! n, m - integer
! mean, sd - real vector of size m
! ---------- ---------- ---------- ---------- ----------

FUNCTION rndn (n, m, mean, sd)

INTEGER :: n, m, i, j
REAL(8), DIMENSION(n, m) :: rndn
REAL(8), DIMENSION(m) :: mean, sd

DO i = 1, n
    DO j = 1, m
        rndn(i, j) = mean(j) + sd(j) * normal()
    END DO
END DO

END FUNCTION rndn

! ---------- ---------- ---------- ---------- ----------
! Function for summing a matrix by column
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION sumc (x)

INTEGER :: n, i
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 2)) :: sumc

n = SIZE(x, 2)
DO i = 1, n
    sumc(i) = SUM(x(:, i))
END DO

END FUNCTION sumc

! ---------- ---------- ---------- ---------- ----------
! Function for finding the maximum of a matrix by column
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION maxc (x)

INTEGER :: n, i
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 2)) :: maxc

n = SIZE(x, 2)
DO i = 1, n
    maxc(i) = MAXVAL(x(:, i))
END DO

END FUNCTION maxc

! ---------- ---------- ---------- ---------- ----------
! Function for finding the argmax of a matrix by column
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION maxindc (x)

INTEGER :: n, i
REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 2)) :: maxindc

n = SIZE(x, 2)
DO i = 1, n
    maxindc(i) = index_of(x(:, i), MAXVAL(x(:, i)))
END DO

END FUNCTION maxindc

! ---------- ---------- ---------- ---------- ----------
! Function for finding the index of x in vector v
! v - real vector
! x - real number
! ---------- ---------- ---------- ---------- ----------

FUNCTION index_of (v, x)

REAL(8), DIMENSION(:) :: v
REAL(8) :: x, index_of
INTEGER :: i, n

n = SIZE(v)
index_of = -1.0
DO i = 1, n
    IF(v(i) == x) THEN
        index_of = i * 1.0
        RETURN
    END IF
END DO

END FUNCTION index_of

! ---------- ---------- ---------- ---------- ----------
! Function for inverting a matrix
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION inv (x)

REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1), SIZE(x, 2)) :: inv
REAL(8) :: det

IF (SIZE(x, 1) == 2) THEN
    det = x(1, 1) * x(2, 2) - x(1, 2) * x(2, 1)
    IF (det == 0.0) THEN
        WRITE(*, *) 'Not Invertible'
        RETURN
    END IF
    inv(1, 1) = x(2, 2) / det
    inv(1, 2) = -x(1, 2) / det
    inv(2, 1) = -x(2, 1) / det
    inv(2, 2) = x(1, 1) / det
    RETURN
ELSE
    inv = solve(x, eye(SIZE(x, 1)))
END IF

END FUNCTION inv

! ---------- ---------- ---------- ---------- ----------
! Function for solving x from a x = b
! a, b - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION solve (a, b)

REAL(8), DIMENSION(:, :) :: a, b
REAL(8), DIMENSION(SIZE(b, 1), SIZE(b, 2)) :: solve

INTEGER :: na, ma, nb, mb
REAL(8), DIMENSION(SIZE(a, 1), SIZE(a, 2) + SIZE(b, 2)) :: d

na = SIZE(a, 1)
ma = SIZE(a, 2)
nb = SIZE(b, 1)
mb = SIZE(b, 2)

IF (na /= nb) THEN
    WRITE (*, *) 'Incompatible'
    RETURN
END IF

d(:, 1:ma) = a
d(:, (ma + 1):(ma + mb)) = b
CALL rref(d)
solve = d(:, (ma + 1):(ma + mb))

END FUNCTION solve

! ---------- ---------- ---------- ---------- ----------
! Subroutine for finding the rref of a matrix
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE rref (x)

REAL(8), DIMENSION(:, :), INTENT(INOUT) :: x

INTEGER :: n, m, i, j, k, l
REAL(8) :: temp

n = SIZE(x, 1)
m = SIZE(x, 2)
IF (n > m) THEN
    WRITE (*, *) 'Not Invertable'
    x = 0.0
    RETURN
END IF

DO i = 1, n
    IF (x(i, i) == 0) THEN
        DO j = i + 1, n
            IF(x(j, i) /= 0) THEN
                DO k = i, m
                    temp = x(j, k)
                    x(j, k) = x(i, k)
                    x(i, k) = temp
                END DO
                EXIT
            END IF
        END DO
    END IF
    IF (x(i, i) == 0) THEN
        WRITE (*, *) 'Not Invertable'
        x = 0.0
        RETURN
    END IF
    DO j = i + 1, m
        x(i, j) = x(i, j) / x(i, i)
    END DO
    x(i, i) = 1.0
    DO k = i + 1, n
        DO l = i + 1, m
            x(k, l) = x(k, l) - x(k, i) * x(i, l)
        END DO
        x(k, i) = 0.0
    END DO
END DO

DO i = n, 1, -1
    DO j = i - 1, 1, -1
        DO k = i + 1, m
            x(j, k) = x(j, k) - x(j, i) * x(i, k)
        END DO
        x(j, i) = 0
    END DO
END DO

END SUBROUTINE rref

! ---------- ---------- ---------- ---------- ----------
! Function for extracting the diagonal elements
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

FUNCTION diag (x)

REAL(8), DIMENSION(:, :) :: x
REAL(8), DIMENSION(SIZE(x, 1)) :: diag

INTEGER :: n, i

n = SIZE(x, 1)

DO i = 1, n
    diag(i) = x(i, i)
END DO

END FUNCTION diag

! ---------- ---------- ---------- ---------- ----------
! Function for constructing the identity matrix of size n
! n - integer
! ---------- ---------- ---------- ---------- ----------

FUNCTION eye (n)

INTEGER :: n, i
REAL(8), DIMENSION(n, n) :: eye

eye = 0.

DO i = 1, n
    eye(i, i) = 1.0
END DO

END FUNCTION eye

! ---------- ---------- ---------- ---------- ----------
! Function for printing matrix x
! x - real matrix
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE prtm (x)

REAL(8), DIMENSION(:, :), INTENT(IN) :: x

INTEGER :: n, m, i, j

n = SIZE(x, 1)
m = SIZE(x, 2)

DO i = 1, n
    DO j = 1, m
        WRITE(*, '(F10.5)', ADVANCE = 'no') x(i, j)
    END DO
    WRITE(*, *) ''
END DO

END SUBROUTINE prtm

! ---------- ---------- ---------- ---------- ----------
! Function for printing vector x
! x - real vector
! ---------- ---------- ---------- ---------- ----------

SUBROUTINE prtv (x)

REAL(8), DIMENSION(:), INTENT(IN) :: x

INTEGER :: n, i

n = SIZE(x)

DO i = 1, n
    WRITE(*, '(F10.5)', ADVANCE = 'no') x(i)
END DO
WRITE(*, *)

END SUBROUTINE prtv

END PROGRAM logit